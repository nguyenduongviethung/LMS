import { ContentRepository } from "./content.repository";
import { ContentFileService } from "../contentFile/contentFile.service";
import { FileRepository } from "../file/file.repository";
import { CreateContentDTO, UpdateContentDTO, ContentPublicDTO } from "@shared/src/content/content.model";

export const ContentService = {
    async getBySessionId(classId: number): Promise<ContentPublicDTO[]> {
        return ContentRepository.findBySessionId(classId);
    },

    async createContent(data: CreateContentDTO): Promise<ContentPublicDTO> {
        const content = await ContentRepository.createContent(data);
        data.files?.forEach(async (file) => {
            await ContentFileService.create({
                contentId: content.contentId,
                fileId: file.fileId,
                roleId: file.roleId
            });
        });
        return content;
    },

    async updateContent(contentId: number, data: UpdateContentDTO): Promise<ContentPublicDTO> {
        await ContentFileService.deleteByContentIds([contentId]);
        data.files?.forEach(async (file) => {
            await ContentFileService.create({
                contentId,
                fileId: file.fileId,
                roleId: file.roleId
            });
        });
        return ContentRepository.updateContent(contentId, data);
    },

    async deleteUnattachedContents(cutoffDate: Date): Promise<number> {
        const UnattachedContents = await ContentRepository.findUnattachedContents(cutoffDate);
        const UnattachedContentIds = UnattachedContents.map(c => c.contentId);
        await ContentFileService.deleteByContentIds(UnattachedContentIds);
        return ContentRepository.deleteByIds(UnattachedContentIds);
    }
};