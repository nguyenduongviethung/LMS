import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { filePublicSelect } from "./file.select";
import { CreateFileDTO, FilePublicDTO } from "backend/src/features/file/file.model";

export const FileRepository = {
    async create(data: CreateFileDTO): Promise<FilePublicDTO> {
        return prisma.file.create({
            data,
            select: filePublicSelect,
        });
    },

    async deleteByIds(fileIds: number[]): Promise<number> {
        return prisma.file.deleteMany({
            where: {
                fileId: { in: fileIds },
            },
        }).then(deleteResult => deleteResult.count);
    },

    async deleteUntachedFiles(cutoffDate: Date): Promise<number> {
        return prisma.file.deleteMany({
            where: {
                contentFiles: {
                    none: {},
                },
                uploadedAt: {
                    lt: cutoffDate,
                },
            },
        }).then(deleteResult => deleteResult.count);
    }
};