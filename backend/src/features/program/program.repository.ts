import { prisma } from "../../shared/prisma/client";
import { programPublicSelect } from "./program.select";
import { ProgramPublicDTO, CreateProgramDTO, UpdateProgramDTO } from "./program.model";

export const ProgramRepository = {
    async findAll(): Promise<ProgramPublicDTO[]> {
        return prisma.program.findMany({
            where: { deletedAt: null },
            select: programPublicSelect,
        });
    },

    async findByIds(programIds: number[]): Promise<ProgramPublicDTO[]> {
        return prisma.program.findMany({
            where: {
                programId: { in: programIds },
                deletedAt: null,
            },
            select: programPublicSelect,
        });
    },

    async findByContentId(contentId: number): Promise<ProgramPublicDTO[]> {
        return prisma.program.findMany({
            where: {
                templateSessions: {
                    some: {
                        templateSessionContents: {
                            some: {
                                contentId,
                            },
                        },
                    },
                },
                deletedAt: null,
            },
            select: programPublicSelect,
        });
    },

    async findByTemplateSessionId(templateSessionId: number): Promise<ProgramPublicDTO[]> {
        return prisma.program.findMany({
            where: {
                templateSessions: {
                    some: {
                        templateSessionId,
                    },
                },
                deletedAt: null,
            },
            select: programPublicSelect,
        });
    },

    create(data: CreateProgramDTO): Promise<ProgramPublicDTO> {
        return prisma.program.create({ 
            data, 
            select: programPublicSelect 
        });
    },

    update(programId: number, data: UpdateProgramDTO): Promise<ProgramPublicDTO> {
        return prisma.program.update({
            where: { programId },
            data,
            select: programPublicSelect,
        });
    },

    async delete(programId: number): Promise<void> {
        await prisma.program.delete({
            where: { programId },
        });
    }
};