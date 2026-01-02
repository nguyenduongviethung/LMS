import { ContentRepository } from "./content.repository";
import { ContentFileService } from "../contentFile/contentFile.service";
import { CreateContentDTO, UpdateContentDTO, ContentPublicDTO } from "backend/src/features/content/content.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { ForbiddenError } from "backend/src/common/errors/ForbiddenError";

export const ContentService = {
    async getBySessionId(classId: number): Promise<ContentPublicDTO[]> {
        return ContentRepository.findBySessionId(classId);
    },

    async createContent(userId: number, data: CreateContentDTO): Promise<ContentPublicDTO> {
        if (!(await AuthorizationService.canCreateContent(userId))) {
            throw new ForbiddenError("Forbidden: You do not have permission to create content.");
        }
        const content = await ContentRepository.createContent(data);
        data.files?.create?.forEach(async (file) => {
            await ContentFileService.create({
                contentId: content.contentId,
                fileId: file.fileId,
                role: file.role
            });
        });
        return content;
    },

    async updateContent(userId: number, contentId: number, data: UpdateContentDTO): Promise<ContentPublicDTO> {
        if (!(await AuthorizationService.canUpdateContent(userId, contentId))) {
            throw new ForbiddenError("Forbidden: You do not have permission to update this content.");
        }
        data.files?.create?.forEach(async (file) => {
            await ContentFileService.create({
                contentId,
                fileId: file.fileId,
                role: file.role
            });
        });
        data.files?.update?.forEach(async (file) => {
            await ContentFileService.update({
                contentId,
                fileId: file.fileId,
                role: file.role
            });
        });
        data.files?.delete?.forEach(async (fileId) => {
            await ContentFileService.delete(contentId, fileId);
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