import { FilePublicDTO } from "./file.types";
import { ContentFileRole } from "../enums/contentFile.enum";

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

export interface UpdateContentFileDTO extends CreateContentFileDTO { }