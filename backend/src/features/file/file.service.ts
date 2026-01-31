import { FileRepository } from "./file.repository";
import { ForbiddenError } from "../../common/errors/ForbiddenError";
import { UserIdentity } from "@shared/src/types/user.types";
import { FileDetailDTO, FilePublicDTO } from "@shared/src/types/file.types";
import { FileType } from "@shared/src/enums/file.enum";
import { Multer } from 'multer';

export const FileService = {
    async uploadFile(currentUser: UserIdentity, file: Express.Multer.File): Promise<FilePublicDTO> {
        if (!file) {
            throw new Error("File is required");
        }

        return FileRepository.create({
            filename: Buffer.from(file.originalname, 'latin1').toString('utf8'),
            filetype: FileType.FILE,
            filepath: file.path,
            filesize: file.size,
            url: ''
        });
    },

    async getById(currentUser: UserIdentity, fileId: number): Promise<FileDetailDTO | null> {
        return FileRepository.findById(fileId);
    },

    async createLink(
        currentUser: UserIdentity,
        data: { filename: string; url: string }
    ): Promise<FilePublicDTO> {
        return FileRepository.create({
            filename: data.filename,
            filetype: 'LINK',
            url: data.url,
            filepath: '',
            filesize: null
        });
    },

    async deleteFilesByIds(fileIds: number[]): Promise<number> {
        return FileRepository.deleteByIds(fileIds);
    },

    async deleteUnattachedFiles(cutoffDate: Date): Promise<number> {
        return FileRepository.deleteUntachedFiles(cutoffDate);
    }
};
