import { SessionContentRepository } from "./sessionContent.repository";
import { SessionContentPublicDTO, CreateSessionContentDTO } from "@shared/src/sessionContent/sessionContent.model";

export const SessionContentService = {
    async create(data: CreateSessionContentDTO): Promise<SessionContentPublicDTO> {
        return SessionContentRepository.create(data);
    },

    async deleteBySessionIds(sessionIds: number[]): Promise<number> {
        return SessionContentRepository.deleteBySessionIds(sessionIds);
    }
};