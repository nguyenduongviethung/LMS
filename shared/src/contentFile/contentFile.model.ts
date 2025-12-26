import { FilePublicDTO } from "../file/file.model";

export interface ContentFilePublicDTO {
    contentId: number;
    file: FilePublicDTO;
    role: {
        roleId: number;
        roleType: String;
    };
}

export interface CreateContentFileDTO {
    contentId: number;
    fileId: number;
    roleId: number;
}