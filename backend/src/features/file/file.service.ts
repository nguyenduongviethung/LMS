import { FileRepository } from "./file.repository";
import { UserIdentity } from "@shared/src/types/user.types";
import { FilePublicDTO } from "@shared/src/types/file.types";
import { FileType } from "@shared/src/enums/file.enum";
import { FilePolicy } from "@/policies/file.policy";
import { ForbiddenError } from "@/common/errors/ForbiddenError";

export const FileService = {
    async uploadFile(currentUser: UserIdentity, file: Express.Multer.File): Promise<FilePublicDTO> {
        if (!await FilePolicy.create(currentUser)) {
            throw new ForbiddenError("FILE.FORBIDDEN_CREATE");
        }
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

    async createLink(currentUser: UserIdentity, data: { filename: string; url: string }): Promise<FilePublicDTO> {
        if (!await FilePolicy.create(currentUser)) {
            throw new ForbiddenError("FILE.FORBIDDEN_CREATE");
        }
        return FileRepository.create({
            filename: data.filename,
            filetype: 'LINK',
            url: data.url,
            filepath: '',
            filesize: null
        });
    },
};
