import { prisma } from "../../shared/prisma/client";
import { contentFilePublicSelect } from "./contentFile.select";
import { ContentFilePublicDTO, CreateContentFileDTO } from "@shared/src/contentFile/contentFile.model";

export const contentFileRepository = {
    async create(data: CreateContentFileDTO): Promise<ContentFilePublicDTO> {
        return prisma.contentFile.create({
            data,
            select: contentFilePublicSelect
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