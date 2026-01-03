import { ContentRepository } from "./content.repository";
import { ContentFileService } from "../contentFile/contentFile.service";
import { CreateContentDTO, UpdateContentDTO, ContentPublicDTO } from "./content.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { ForbiddenError } from "../../common/errors/ForbiddenError";
import { UserIdentity } from "../user/user.model";

export const ContentService = {
    async getBySessionId(currentUser: UserIdentity, sessionId: number): Promise<ContentPublicDTO[]> {
        if (!(await AuthorizationService.canGetSession(currentUser, sessionId))) {
            throw new ForbiddenError("Forbidden: You do not have permission to access contents of this session.");
        }
        return ContentRepository.findBySessionId(sessionId);
    },

    async getByFileId(fileId: number): Promise<ContentPublicDTO[]> {
        return ContentRepository.findByFileId(fileId);
    },

    async createContent(currentUser: UserIdentity, data: CreateContentDTO): Promise<ContentPublicDTO> {
        if (!(await AuthorizationService.canCreateContent(currentUser))) {
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

    async updateContent(currentUser: UserIdentity, contentId: number, data: UpdateContentDTO): Promise<ContentPublicDTO> {
        if (!(await AuthorizationService.canUpdateContent(currentUser, contentId))) {
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