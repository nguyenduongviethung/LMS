export interface FilePublicDTO {
    fileId: number;
    filename: string;
    filetype: string;
    filesize: number;
    uploadedAt: Date;
}

export interface CreateFileDTO {
    filename: string;
    filetype: string;
    filepath: string;
    filesize: number;
}
