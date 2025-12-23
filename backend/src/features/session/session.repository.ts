import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { sessionPublicSelect } from "./session.select";
import { SessionPublicDTO } from "@shared/src/session/session.model";

export const SessionRepository = {
    async findByClassIds(classIds: number[]): Promise<SessionPublicDTO[]> {
        return prisma.session.findMany({
            where: {
                isDeleted: false,
                classId: { in: classIds }
            },
            select: sessionPublicSelect,
        });
    }
};
