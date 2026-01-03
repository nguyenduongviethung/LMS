import { prisma } from "../../shared/prisma/client";
import { contentFilePublicSelect } from "./contentFile.select";
import { ContentFilePublicDTO, CreateContentFileDTO, UpdateContentFileDTO } from "./contentFile.model";

export const contentFileRepository = {
    async create(data: CreateContentFileDTO): Promise<ContentFilePublicDTO> {
        return prisma.contentFile.create({
            data,
            select: contentFilePublicSelect
        });
    },

    async update(data: UpdateContentFileDTO): Promise<ContentFilePublicDTO> {
        return prisma.contentFile.update({
            where: {
                contentId_fileId: {
                    contentId: data.contentId,
                    fileId: data.fileId
                }
            },
            data,
            select: contentFilePublicSelect
        });
    },

    async delete(contentId: number, fileId: number): Promise<void> {
        await prisma.contentFile.delete({
            where: {
                contentId_fileId: {
                    contentId,
                    fileId
                }
            }
        });
    },

    async deleteByContentIds(contentIds: number[]): Promise<number> {
        return prisma.contentFile.deleteMany({
            where: {
                contentId: { in: contentIds }
            }
        }).then(deleteResult => deleteResult.count);
    }
};