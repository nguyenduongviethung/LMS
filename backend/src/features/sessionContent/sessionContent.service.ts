import { SessionContentRepository } from "./sessionContent.repository";
import { SessionContentPublicDTO, CreateSessionContentDTO } from "./sessionContent.model";

export const SessionContentService = {
    async create(data: CreateSessionContentDTO): Promise<SessionContentPublicDTO> {
        return SessionContentRepository.create(data);
    },

    async delete(sessionId: number, contentId: number): Promise<void> {
        return SessionContentRepository.delete(sessionId, contentId);
    },

    async deleteBySessionIds(sessionIds: number[]): Promise<number> {
        return SessionContentRepository.deleteBySessionIds(sessionIds);
    }
};