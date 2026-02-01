import { prisma } from "../../database/client";
import { filePublicSelect } from "./file.select";
import { CreateFileDTO, FilePublicDTO } from "@shared/src/types/file.types";

export const FileRepository = {
    async create(data: CreateFileDTO): Promise<FilePublicDTO> {
        return prisma.file.create({
            data,
            select: filePublicSelect,
        });
    },
};