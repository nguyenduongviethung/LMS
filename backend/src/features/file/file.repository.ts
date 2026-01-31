import { prisma } from "../../database/client";
import { fileDetailSelect, filePublicSelect } from "./file.select";
import { CreateFileDTO, FileDetailDTO, FilePublicDTO } from "@shared/src/types/file.types";

export const FileRepository = {
    async create(data: CreateFileDTO): Promise<FilePublicDTO> {
        return prisma.file.create({
            data,
            select: filePublicSelect,
        });
    },

    async findById(fileId: number): Promise<FileDetailDTO | null> {
        return prisma.file.findUnique({
            where: { fileId },
            select: fileDetailSelect
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