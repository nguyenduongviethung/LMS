import { SessionRepository } from "./session.repository";
import { UserIdentity } from "@shared/src/user/user.model";
import { ClassService } from "../class/class.service";
import { SessionContentService } from "../sessionContent/sessionContent.service";
import { CreateSessionDTO, SessionPublicDTO, UpdateSessionDTO } from "@shared/src/session/session.model";

export const SessionService = {
    async getSessions(currentUser: UserIdentity) {
        const allowedClassIds = await ClassService.getAllowedClassIds(currentUser);
        return SessionRepository.findByClassIds(allowedClassIds);
    },

    async createSession(data: CreateSessionDTO, currentUser: UserIdentity): Promise<SessionPublicDTO> {
        // check permission
        const canManageUserClass = await ClassService.canManageClass(currentUser, data.classId);
        if (!canManageUserClass) {
            throw new Error("Unauthorized to create session for this class");
        }
        const session = await SessionRepository.createSesion(data);
        data.contents?.forEach(async content => {
            await SessionContentService.create({
                sessionId: session.sessionId,
                contentId: content.contentId
            });
        });
        return session;
    },

    async updateSession(sessionId: number, data: UpdateSessionDTO): Promise<SessionPublicDTO> {
        await SessionContentService.deleteBySessionIds([sessionId]);
        data.contents?.forEach(async (content) => {
            await SessionContentService.create({
                sessionId,
                contentId: content.contentId
            });
        });
        return SessionRepository.updateSession(sessionId, data);
    },

    async deleteSession(sessionId: number): Promise<SessionPublicDTO> {
        return SessionRepository.updateSession(sessionId, { isDeleted: true });
    }
};