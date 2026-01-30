import { prisma } from '../../database/client';
import { classPublicSelect } from './class.select';
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from '@shared/src/types/class.types';

export const ClassRepository = {
    async findAllIds(): Promise<number[]> {
        return prisma.class.findMany({
            where: { deletedAt: null },
            select: { classId: true },
        }).then(classes => classes.map(c => c.classId));
    },

    async findByIds(classIds: number[]): Promise<ClassPublicDTO[]> {
        return prisma.class.findMany({
            where: { 
                deletedAt: null,
                classId: { in: classIds }
            },
            select: classPublicSelect,
        });
    },

    async findById(classId: number): Promise<ClassPublicDTO | null> {
        return prisma.class.findFirst({
            where: { 
                deletedAt: null,
                classId,
            },
            select: classPublicSelect,
        });
    },

    async findBySessionId(sessionId: number): Promise<ClassPublicDTO[]> {
        return prisma.class.findMany({
            where: {
                sessions: {
                    some: {
                        sessionId,
                    },
                },
                deletedAt: null,
            },
            select: classPublicSelect,
        });
    },

    async findByContentId(contentId: number): Promise<ClassPublicDTO[]> {
        return prisma.class.findMany({
            where: {
                sessions: {
                    some: {
                        sessionContents: {
                            some: {
                                contentId,
                            },
                        },
                    },
                },
                deletedAt: null,
            },
            select: classPublicSelect,
        });
    },
    
    create(data: CreateClassDTO): Promise<ClassPublicDTO> {
        return prisma.class.create({ 
            data, 
            select: classPublicSelect
        });
    },


    update(classId: number, data: UpdateClassDTO): Promise<ClassPublicDTO> {
        return prisma.class.update({
            where: { classId },
            data,
            select: classPublicSelect,
        });
    },

    delete(classId: number): Promise<ClassPublicDTO> {
        return prisma.class.update({
            data: { deletedAt: new Date()},
            where: { classId },
            select: classPublicSelect,
        });
    }
};