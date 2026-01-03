import { prisma } from '../../shared/prisma/client';
import { classPublicSelect } from './class.select';
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from '../class/class.model';

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
};