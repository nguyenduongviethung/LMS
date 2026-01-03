import { UserClassRole } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { userClassPublicSelect } from "./userClass.select";
import { UserClassPublicDTO, CreateUserClassDTO, UpdateUserClassDTO } from "./userClass.model";

export const userClassRepository = {
    async findById(userClassId: number): Promise<UserClassPublicDTO | null> {
        return prisma.userClass.findFirst({
            where: {
                userClassId,
                deletedAt: null,
            },
            select: userClassPublicSelect,
        });
    },
    
    async findByUserId(userId: number): Promise<UserClassPublicDTO[]> {
        return prisma.userClass.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            select: userClassPublicSelect,
        });
    },

    async findUsersByClassIds(classIds: number[]): Promise<number[]> {
        return prisma.userClass.findMany({
            where: {
                classId: { in: classIds },
                deletedAt: null,
            },
            select: {
                userId: true,
            },
        }).then(ucs => ucs.map(uc => uc.userId));
    },

    async findTeachersByClassIds(classIds: number[]): Promise<{ userId: number; classId: number }[]> {
        return prisma.userClass.findMany({
            where: {
                classId: { in: classIds },
                deletedAt: null,
                role: UserClassRole.TEACHER, 
            },
            select: {
                userId: true,
                classId: true,
            },
        });
    },

    async findClassesByTeacherIds(teacherIds: number []): Promise<number[]> {
        return prisma.userClass.findMany({
            where: {
                userId: { in: teacherIds },
                deletedAt: null,
                role: UserClassRole.TEACHER,
            },
            select: {
                classId: true,
            },
        }).then(ucs => ucs.map(uc => uc.classId));
    },

    async findByUserIdAndClassId(userId: number, classId: number): Promise<UserClassPublicDTO[]> {
        return prisma.userClass.findMany({
            where: {
                userId,
                classId,
                deletedAt: null,
            },
            select: userClassPublicSelect
        });
    },

    async create(data: CreateUserClassDTO): Promise<UserClassPublicDTO> {
        return prisma.userClass.create({
            data,
            select: userClassPublicSelect,
        });
    },

    async update(userClassId: number, data: UpdateUserClassDTO): Promise<UserClassPublicDTO> {
        return prisma.userClass.update({
            where: { 
                userClassId: userClassId,
            },
            data,
            select: userClassPublicSelect,
        });
    }
                
};
