import { prisma } from '../../shared/prisma/client';
import { classPublicSelect } from './class.select';
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from '@shared/src/class/class.model';

export const ClassRepository = {
    async findAllIds(): Promise<number[]> {
        return prisma.class.findMany({
            where: { isDeleted: false },
            select: { classId: true },
        }).then(classes => classes.map(c => c.classId));
    },

    async findByIds(classIds: number[]): Promise<ClassPublicDTO[]> {
        return prisma.class.findMany({
            where: { 
                isDeleted: false,
                classId: { in: classIds }
            },
            select: classPublicSelect,
        });
    },

    async findByUser(userId: number): Promise<ClassPublicDTO[]> {
        return prisma.class.findMany({
            where: { 
                isDeleted: false,
                userClasses: {
                    some: {
                        userId
                    }
                }
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