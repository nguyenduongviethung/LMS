import { FileRepository } from "./file.repository";
import { FilePublicDTO } from "backend/src/features/file/file.model";

export const FileService = {
    async uploadFile(file: Express.Multer.File): Promise<FilePublicDTO> {
        if (!file) {
            throw new Error("File is required");
        }

        return FileRepository.create({
            filename: file.originalname,
            filetype: file.mimetype,
            filepath: file.path,
            filesize: file.size,
        });
    },

    async deleteFilesByIds(fileIds: number[]): Promise<number> {
        return FileRepository.deleteByIds(fileIds);
    },

    async deleteUnattachedFiles(cutoffDate: Date): Promise<number> {
        return FileRepository.deleteUntachedFiles(cutoffDate);
    }
};
