import { SessionRepository } from "./session.repository";
import { UserIdentity } from "backend/src/features/user/user.model";
import { ClassService } from "../class/class.service";
import { SessionContentService } from "../sessionContent/sessionContent.service";
import { CreateSessionDTO, SessionPublicDTO, UpdateSessionDTO } from "backend/src/features/session/session.model";
import { AuthorizationService } from "../authorization/authorization.service";

export const SessionService = {
    async getSessions(currentUser: UserIdentity) {
        const allowedClassIds = await ClassService.getAllowedClassIds(currentUser);
        return SessionRepository.findByClassIds(allowedClassIds);
    },

    async createSession(currentUser: UserIdentity, data: CreateSessionDTO): Promise<SessionPublicDTO> {
        if (!await AuthorizationService.canManageSession(currentUser.userId, data.classId)) {
            throw new Error("Unauthorized");
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
        if (!await AuthorizationService.canManageSession(currentUser.userId!, data.classId!)) {
            throw new Error("Unauthorized");
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
        if (!await AuthorizationService.canManageSession(currentUser.userId, session.class.classId)) {
            throw new Error("Unauthorized");
        }
        return SessionRepository.updateSession(sessionId, { deletedAt: new Date() } );
    }
};