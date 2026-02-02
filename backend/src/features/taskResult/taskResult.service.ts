import { TaskResultRepository } from "./taskResult.repository";
import { SessionService } from "../session/session.service";
import { ContentService } from "../content/content.service";
import { UserClassService } from "../userClass/userClass.service";
import { SessionContentService } from "../sessionContent/sessionContent.service";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { TaskResultPublicDTO, UpdateTaskResultDTO } from "@shared/src/types/taskResult.types";
import { UserIdentity } from "@shared/src/types/user.types";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { ContentPolicy } from "@/policies/content.policy";
import { ForbiddenError } from "@/common/errors/ForbiddenError";
import { SessionPolicy } from "@/policies/session.policy";
import { ConflictError } from "@/common/errors/ConflictError";

export const TaskResultService = {
    async ensureTaskResult(currentUser: UserIdentity, sessionId: number, contentId: number): Promise<TaskResultPublicDTO[]> {
        if(!await ContentPolicy.manageTaskResults(currentUser, contentId)) {
            throw new ForbiddenError("TASK_RESULT.FORBIDDEN_MANAGE");
        }
        const sessionContent = await SessionContentService.getBySessionIdAndContentId(currentUser, sessionId, contentId);
        if (!sessionContent) throw new NotFoundError("SESSION_CONTENT.NOT_FOUND");

        const startTime = sessionContent.session.startTime
        if (!startTime) {
            throw new ConflictError("SESSION.START_TIME_NOT_SET");
        }
        const userClasses =
            await UserClassService.getByClassId(currentUser, false, sessionContent.session.class.classId, [UserClassRole.STUDENT]);

        const validUserIds = userClasses
            .filter(uc => uc.data.enrolledAt <= startTime && (uc.data.deletedAt === null || uc.data.deletedAt >= startTime))
            .map(uc => uc.data.user.userId);

        await Promise.all(validUserIds.map(userId => TaskResultRepository.upsert(contentId, userId)));
        await TaskResultRepository.deleteInvalidTaskResult(contentId, validUserIds);
        return TaskResultRepository.findByUserIdsAndContentIds({ contentIds: [contentId] });

    },

    async getSessionContentTaskResult(currentUser: UserIdentity, sessionId: number, contentId: number): Promise<TaskResultPublicDTO[]> {
        if (!await SessionPolicy.get(currentUser, sessionId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_GET");
        }
        const sessionContent = await SessionContentService.getBySessionIdAndContentId(currentUser, sessionId, contentId);
        if (!sessionContent) throw new NotFoundError("SESSION_CONTENT.NOT_FOUND");

        const startTime = sessionContent.session.startTime
        if (!startTime) {
            return [];
        }
        const userClasses =
            await UserClassService.getByClassId(currentUser, false, sessionContent.session.class.classId, [UserClassRole.STUDENT]);

        const validUserIds = userClasses
            .filter(uc => uc.data.enrolledAt <= startTime && (uc.data.deletedAt === null || uc.data.deletedAt >= startTime))
            .map(uc => uc.data.user.userId);
        return TaskResultRepository.findByUserIdsAndContentIds({ userIds: validUserIds, contentIds: [contentId]});
    },
    
    async getUserSessionTaskResult(currentUser: UserIdentity, userId: number, sessionId: number): Promise<TaskResultPublicDTO[]> {
        if (!await SessionPolicy.get(currentUser, sessionId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_GET");
        }
        const session = (await SessionService.getById(currentUser, sessionId));
        if (!session) throw new NotFoundError("SESSION.NOT_FOUND");
        const contents = await ContentService.getBySessionId(currentUser, session.data.sessionId);
        return TaskResultRepository.findByUserIdsAndContentIds({ userIds: [userId], contentIds: contents.map(content => content.data.contentId)})
    },

    async updateTaskResult(currentUser: UserIdentity, contentId: number, userId: number, data: UpdateTaskResultDTO): Promise<TaskResultPublicDTO> {
        if (!await ContentPolicy.manageTaskResults(currentUser, contentId)) {
            throw new ForbiddenError("TASK_RESULT.FORBIDDEN_MANAGE");
        }
        await TaskResultRepository.upsert(contentId, userId);
        return TaskResultRepository.updateTaskResult(contentId, userId, data);
    }
}