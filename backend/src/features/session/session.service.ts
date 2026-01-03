import { SessionRepository } from "./session.repository";
import { UserIdentity } from "../user/user.model";
import { ClassService } from "../class/class.service";
import { SessionContentService } from "../sessionContent/sessionContent.service";
import { CreateSessionDTO, SessionPublicDTO, UpdateSessionDTO } from "./session.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { ForbiddenError } from "../../common/errors/ForbiddenError";

export const SessionService = {
    async getSessions(currentUser: UserIdentity) {
        const allowedClassIds = await ClassService.getAllowedClassIds(currentUser);
        return SessionRepository.findByClassIds(allowedClassIds);
    },

    async getByContentId(contentId: number): Promise<SessionPublicDTO[]> {
        return SessionRepository.findByContentId(contentId);
    },

    async createSession(currentUser: UserIdentity, data: CreateSessionDTO): Promise<SessionPublicDTO> {
        if (!await AuthorizationService.canManageSession(currentUser, data.classId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to create sessions for this class.");
        }
        const session = await SessionRepository.createSesion(data);
        data.contents?.create?.forEach(async content => {
            await SessionContentService.create({
                sessionId: session.sessionId,
                contentId: content.contentId
            });
        });
        return session;
    },

    async updateSession(currentUser: UserIdentity, sessionId: number, data: UpdateSessionDTO): Promise<SessionPublicDTO> {
        if (!await AuthorizationService.canManageSession(currentUser, data.classId!)) {
            throw new ForbiddenError("Forbidden: You do not have permission to update sessions for this class.");
        }
        data.contents?.create?.forEach(async (content) => {
            await SessionContentService.create({
                sessionId,
                contentId: content.contentId
            });
        });
        data.contents?.delete?.forEach(async (contentId) => {
            await SessionContentService.delete(sessionId, contentId);
        });
        return SessionRepository.updateSession(sessionId, data);
    },

    async deleteSession(currentUser: UserIdentity, sessionId: number): Promise<SessionPublicDTO> {
        const session = await SessionRepository.findBySessionId(sessionId);
        if (!await AuthorizationService.canManageSession(currentUser, session.class.classId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to delete sessions for this class.");
        }
        return SessionRepository.updateSession(sessionId, { deletedAt: new Date() } );
    }
};