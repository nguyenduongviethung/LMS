import { FilePublicDTO } from "../file/file.model";
import { ContentFileRole } from "@prisma/client";

export interface ContentFilePublicDTO {
    contentId: number;
    file: FilePublicDTO;
    role: String;
}

export interface CreateContentFileDTO {
    contentId: number;
    fileId: number;
    role: ContentFileRole;
}

export interface UpdateContentFileDTO {
    contentId: number;
    fileId: number;
    role?: ContentFileRole;
}