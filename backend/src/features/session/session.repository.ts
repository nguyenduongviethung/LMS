import { prisma } from "../../shared/prisma/client";
import { sessionPublicSelect } from "./session.select";
import { SessionPublicDTO, CreateSessionDTO, UpdateSessionDTO } from "@shared/src/session/session.model";

export const SessionRepository = {
    async findByClassIds(classIds: number[]): Promise<SessionPublicDTO[]> {
        return prisma.session.findMany({
            where: {
                isDeleted: false,
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
