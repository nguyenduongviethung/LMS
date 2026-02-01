import { FileType } from "../enums/file.enum";

export interface FilePublicDTO {
    fileId: number;
    filename: string;
    filetype: FileType;
    filesize: number | null;
    url: string;
    uploadedAt: Date;
}

export interface CreateFileDTO {
    filename: string;
    filetype: FileType;
    filepath: string;
    url: string;
    filesize: number | null;
}
