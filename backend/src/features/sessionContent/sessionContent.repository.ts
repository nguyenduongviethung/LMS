import { prisma } from "backend/src/shared/prisma/client";
import { sessionContentPublicSelect } from "./sessionContent.select";
import { CreateSessionContentDTO, SessionContentPublicDTO } from "backend/src/features/sessionContent/sessionContent.model";

export const SessionContentRepository = {
    async create(data: CreateSessionContentDTO): Promise<SessionContentPublicDTO> {
        return prisma.sessionContent.create({
            data,
            select: sessionContentPublicSelect
        });
    },

    async delete(sessionId: number, contentId: number): Promise<void> {
        await prisma.sessionContent.delete({
            where: {
                sessionId_contentId: {
                    sessionId,
                    contentId
                }
            }
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