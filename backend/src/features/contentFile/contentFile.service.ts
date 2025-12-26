import { contentFileRepository } from "./contentFile.repository";
import { ContentFilePublicDTO, CreateContentFileDTO } from "@shared/src/contentFile/contentFile.model";

export const ContentFileService = {
    async create(data: CreateContentFileDTO): Promise<ContentFilePublicDTO> {
        return contentFileRepository.create(data);
    },

    async deleteByContentIds(contentIds: number[]): Promise<number> {
        return contentFileRepository.deleteByContentIds(contentIds);
    }
}