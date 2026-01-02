import { FileRepository } from "./file.repository";
import { FilePublicDTO } from "backend/src/features/file/file.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { UserIdentity } from "../user/user.model";
import { ForbiddenError } from "backend/src/common/errors/ForbiddenError";

export const FileService = {
    async uploadFile(currentUser: UserIdentity, file: Express.Multer.File): Promise<FilePublicDTO> {
        if (!await AuthorizationService.canCreateFile(currentUser)) {
            throw new ForbiddenError("Forbidden: You do not have permission to upload files.");
        }
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
