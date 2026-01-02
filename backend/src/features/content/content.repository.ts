import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { contentPublicSelect } from "./content.select";
import { CreateContentDTO, ContentPublicDTO, UpdateContentDTO } from "backend/src/features/content/content.model";

export const ContentRepository = {
    async findBySessionId(sessionId: number): Promise<ContentPublicDTO[]> {
        // 1. Lấy session + templateSessionId
        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { templateSessionId: true },
        });

        if (!session) {
            throw new Error("Session not found");
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

    async createContent(data: CreateContentDTO): Promise<ContentPublicDTO> {
        return prisma.content.create({
            data,
            select: contentPublicSelect
        });
    },

    async updateContent(contentId: number, data: UpdateContentDTO): Promise<ContentPublicDTO> {
        return prisma.content.update({
            where: { contentId },
            data,
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
