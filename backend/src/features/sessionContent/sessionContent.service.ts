import { SessionPolicy } from "@/policies/session.policy";
import { SessionContentRepository } from "./sessionContent.repository";
import { SessionContentPublicDTO, CreateSessionContentDTO } from "@shared/src/types/sessionContent.types";
import { UserIdentity } from "@shared/src/types/user.types";

export const SessionContentService = {
    async getBySessionIdAndContentId(currentUser: UserIdentity, sessionId: number, contentId: number): Promise<SessionContentPublicDTO | null> {
        if(!await SessionPolicy.get(currentUser, sessionId)) {
            throw new Error("SESSION_CONTENT.FORBIDDEN_GET");
        }
        return SessionContentRepository.findBySessionIdAndContentId(sessionId, contentId);
    },

    async create(currentUser: UserIdentity, data: CreateSessionContentDTO): Promise<SessionContentPublicDTO> {
        if(!await SessionPolicy.manage(currentUser, data.sessionId)) {
            throw new Error("SESSION_CONTENT.FORBIDDEN_CREATE");
        }
        return SessionContentRepository.create(data);
    },

    async delete(currentUser: UserIdentity, sessionId: number, contentId: number): Promise<void> {
        if(!await SessionPolicy.manage(currentUser, sessionId)) {
            throw new Error("SESSION_CONTENT.FORBIDDEN_DELETE");
        }
        return SessionContentRepository.delete(sessionId, contentId);
    },
};