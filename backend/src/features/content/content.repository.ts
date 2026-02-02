import { Prisma } from "@prisma/client";
import { prisma } from "../../database/client";
import { contentPublicSelect } from "./content.select";
import { CreateContentDTO, ContentPublicDTO, UpdateContentDTO } from "@shared/src/types/content.types";
import { NotFoundError } from "@/common/errors/NotFoundError";

export const ContentRepository = {
    async findByIds(contentIds: number[]): Promise<ContentPublicDTO[]> {
        return prisma.content.findMany({
            where: { contentId: { in: contentIds }},
            select: contentPublicSelect
        })
    },

    async findBySessionId(sessionId: number): Promise<ContentPublicDTO[]> {
        // 1. Lấy session + templateSessionId
        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { templateSessionId: true },
        });

        if (!session) {
            throw new NotFoundError("SESSION.NOT_FOUND");
        }

        // 2. Điều kiện content gắn trực tiếp với session
        const orConditions: Prisma.ContentWhereInput[] = [
            {
                sessionContents: {
                    some: { sessionId },
                },
            },
        ];

        // 3. Nếu có templateSessionId thì thêm điều kiện content từ template
        if (session.templateSessionId) {
            orConditions.push({
                templateSessionContents: {
                    some: {
                        templateSessionId: session.templateSessionId,
                    },
                },
            });
        }

        // 4. Query content
        return prisma.content.findMany({
            where: {
                OR: orConditions,
            },
            select: contentPublicSelect,
        });
    },

    async findByFileId(fileId: number): Promise<ContentPublicDTO[]> {
        return prisma.content.findMany({
            where: {
                contentFiles: {
                    some: {
                        fileId,
                    },
                },
            },
            select: contentPublicSelect,
        });
    },

    async createContent(data: CreateContentDTO): Promise<ContentPublicDTO> {
        const { contentFiles, deadline, ...contentData } = data;
        const content = await prisma.content.create({
            data: contentData,
            select: contentPublicSelect
        });
        return content;
    },

    async updateContent(contentId: number, data: UpdateContentDTO): Promise<ContentPublicDTO> {
        const { contentFiles, ...contentData } = data;
        return prisma.content.update({
            where: { contentId },
            data: contentData,
            select: contentPublicSelect
        });
        
    },

    async deleteByIds(contentIds: number[]): Promise<number> {
        return prisma.content.deleteMany({
            where: {
                contentId: { in: contentIds }
            }
        }).then(res => res.count);
    },

    async findUnattachedContents(cutoffDate: Date): Promise<ContentPublicDTO[]> {
        return prisma.content.findMany({
            where: {
                sessionContents: {
                    none: {},
                },
                createdAt: {
                    lt: cutoffDate,
                },
            },
            select: contentPublicSelect  
        });
    },

    async deleteUnattachedContents(cutoffDate: Date): Promise<number> {
        return prisma.content.deleteMany({
            where: {
                sessionContents: {
                    none: {},
                },
                createdAt: {
                    lt: cutoffDate,
                },
            } 
        }).then(deleteResult => deleteResult.count);
    }
};
