import { prisma } from "../../database/client";
import { sessionContentPublicSelect } from "./sessionContent.select";
import { CreateSessionContentDTO, SessionContentPublicDTO } from "@shared/src/types/sessionContent.types";

export const SessionContentRepository = {
    async findBySessionIdAndContentId(sessionId: number, contentId: number): Promise<SessionContentPublicDTO | null> {
        return prisma.sessionContent.findFirst({
            where: {
                sessionId,
                contentId
            },
            select: sessionContentPublicSelect
        })
    },

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