import { prisma } from "../../database/client";
import { sessionPublicSelect } from "./session.select";
import { SessionPublicDTO, CreateSessionDTO, UpdateSessionDTO } from "@shared/src/types/session.types";

function mapSessionToDTO(session: any): SessionPublicDTO {
    return {
        sessionId: session.sessionId,
        name: session.name,
        description: session.description,
        startTime: session.startTime,
        duration: session.duration,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        class: session.class,
        templateSession: session.templateSession
            ? {
                templateSessionId: session.templateSession.templateSessionId,
                name: session.templateSession.name,
                description: session.templateSession.description,
            }
            : null,
    };
}


export const SessionRepository = {
    async findByIds(sessionIds: number[]): Promise<SessionPublicDTO[]> {
        return prisma.session.findMany({
            where: {
                sessionId: { in: sessionIds },
                deletedAt: null
            },
            select: sessionPublicSelect,
        }).then(sessions => sessions.map((session) => {
            if (session === null) throw new Error('Session not found');
            return mapSessionToDTO(session);
        }));
    },

    async findById(sessionId: number): Promise<SessionPublicDTO | null> {
        const session = await prisma.session.findFirst({
            where: {
                sessionId,
                deletedAt: null
            },
            select: sessionPublicSelect,
        });
        return session ? mapSessionToDTO(session) : null;
    },

    async findByClassId(classId: number): Promise<SessionPublicDTO[]> {
        return prisma.session.findMany({
            where: {
                deletedAt: null,
                classId
            },
            select: sessionPublicSelect,
        }).then(sessions => sessions.map(mapSessionToDTO));
    },

    async findByContentId(contentId: number): Promise<SessionPublicDTO[]> {
        return prisma.session.findMany({
            where: {
                deletedAt: null,
                sessionContents: {
                    some: {
                        contentId
                    }
                }
            },
            select: sessionPublicSelect,
        }).then(sessions => sessions.map(mapSessionToDTO));
    },

    async createSesion(data: CreateSessionDTO): Promise<SessionPublicDTO> {
        return prisma.session.create({
            data,
            select: sessionPublicSelect,
        }).then(mapSessionToDTO);
    },

    async updateSession(sessionId: number, data: UpdateSessionDTO): Promise<SessionPublicDTO> {
        return prisma.session.update({
            where: { sessionId },
            data,
            select: sessionPublicSelect
        }).then(mapSessionToDTO);
    },

    async deleteSession(sessionId: number): Promise<SessionPublicDTO> {
        return prisma.session.update({
            where: { sessionId },
            data: { deletedAt: new Date() },
            select: sessionPublicSelect
        }).then(mapSessionToDTO);
    }
};
