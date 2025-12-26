import { prisma } from "backend/src/shared/prisma/client";
import { sessionContentPublicSelect } from "./sessionContent.select";
import { CreateSessionContentDTO, SessionContentPublicDTO } from "@shared/src/sessionContent/sessionContent.model";

export const SessionContentRepository = {
    async create(data: CreateSessionContentDTO): Promise<SessionContentPublicDTO> {
        return prisma.sessionContent.create({
            data,
            select: sessionContentPublicSelect
        });
    },

    async deleteBySessionIds(sessionIds: number[]): Promise<number> {
        return prisma.sessionContent.deleteMany({
            where: {
                sessionId: { in: sessionIds }
            }
        }).then(deleteResult => deleteResult.count);
    }
};