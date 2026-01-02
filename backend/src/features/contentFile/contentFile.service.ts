import { contentFileRepository } from "./contentFile.repository";
import { ContentFilePublicDTO, CreateContentFileDTO, UpdateContentFileDTO } from "backend/src/features/contentFile/contentFile.model";

export const ContentFileService = {
    async create(data: CreateContentFileDTO): Promise<ContentFilePublicDTO> {
        return contentFileRepository.create(data);
    },

    async update(data: UpdateContentFileDTO): Promise<ContentFilePublicDTO> {
        return contentFileRepository.update(data);
    },

    async delete(contentId: number, fileId: number): Promise<void> {
        return contentFileRepository.delete(contentId, fileId);
    },

    async deleteByContentIds(contentIds: number[]): Promise<number> {
        return contentFileRepository.deleteByContentIds(contentIds);
    }
}