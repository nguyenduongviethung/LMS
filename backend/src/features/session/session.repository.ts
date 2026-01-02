import { findAncestor } from "typescript";
import { prisma } from "../../shared/prisma/client";
import { sessionPublicSelect } from "./session.select";
import { SessionPublicDTO, CreateSessionDTO, UpdateSessionDTO } from "backend/src/features/session/session.model";

export const SessionRepository = {
    async findBySessionId(sessionId: number): Promise<SessionPublicDTO> {
        return prisma.session.findUniqueOrThrow({
            where: {
                sessionId,
                deletedAt: null
            },
            select: sessionPublicSelect,
        });
    },

    async findByClassIds(classIds: number[]): Promise<SessionPublicDTO[]> {
        return prisma.session.findMany({
            where: {
                deletedAt: null,
                classId: { in: classIds }
            },
            select: sessionPublicSelect,
        });
    },

    async createSesion(data: CreateSessionDTO): Promise<SessionPublicDTO> {
        return prisma.session.create({
            data,
            select: sessionPublicSelect,
        });
    },

    async updateSession(sessionId: number, data: UpdateSessionDTO): Promise<SessionPublicDTO> {
        return prisma.session.update({
            where: { sessionId },
            data,
            select: sessionPublicSelect
        });
    }
};
