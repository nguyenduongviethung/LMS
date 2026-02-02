import { ContentRepository } from "./content.repository";
import { ContentFileService } from "../contentFile/contentFile.service";
import { ForbiddenError } from "../../common/errors/ForbiddenError";
import { CreateContentDTO, UpdateContentDTO, ContentPublicDTO } from "@shared/src/types/content.types";
import { WithPermission } from "@shared/src/types/permission.types";
import { UserIdentity } from "@shared/src/types/user.types";
import { ContentPolicy } from "@/policies/content.policy";
import { SessionPolicy } from "@/policies/session.policy";

const addPermission = async (currentUser: UserIdentity, content: ContentPublicDTO): Promise<WithPermission<ContentPublicDTO>> => {
    return {
        data: content,
        permission: {
            canUpdate: await ContentPolicy.manage(currentUser, content.contentId),
            canDelete: await ContentPolicy.manage(currentUser, content.contentId),
            canManageTaskResult: await ContentPolicy.manageTaskResults(currentUser, content.contentId),
        }
    }
};

export const ContentService = {
    async getBySessionId(currentUser: UserIdentity, sessionId: number): Promise<WithPermission<ContentPublicDTO>[]> {
        if(!await SessionPolicy.get(currentUser, sessionId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_GET");
        }
        const result = await ContentRepository.findBySessionId(sessionId);
        return Promise.all(result.map(async content => await addPermission(currentUser, content)));
    },

    async getByFileId(fileId: number): Promise<ContentPublicDTO[]> {
        return ContentRepository.findByFileId(fileId);
    },

    async createContent(currentUser: UserIdentity, data: CreateContentDTO): Promise<ContentPublicDTO> {
        if (!(await ContentPolicy.create(currentUser))) {
            throw new ForbiddenError("CONTENT.FORBIDDEN_CREATE");
        }
        const content = await ContentRepository.createContent(data);
        await ContentFileService.deleteByContentId(content.contentId);
        for (const contentFile of data.contentFiles) {
            await ContentFileService.create({
                contentId: content.contentId,
                fileId: contentFile.file.fileId,
                role: contentFile.role
            });
        }
        return content;
    },

    async updateContent(currentUser: UserIdentity, contentId: number, data: UpdateContentDTO): Promise<ContentPublicDTO> {
        if (!(await ContentPolicy.manage(currentUser, contentId))) {
            throw new ForbiddenError("CONTENT.FORBIDDEN_UPDATE");
        }
        await ContentFileService.deleteByContentId(contentId);
        for (const contentFile of data.contentFiles) {
            await ContentFileService.create({
                contentId,
                fileId: contentFile.file.fileId,
                role: contentFile.role
            });
        }
        return ContentRepository.updateContent(contentId, data);
    },
};