import { prisma } from "../../shared/prisma/client";
import { userClassPublicSelect } from "./userClass.select";
import { UserClassPublicDTO, CreateUserClassDTO, UpdateUserClassDTO } from "@shared/src/userClass/userClass.model";

export const userClassRepository = {
    findByUserId(userId: number) {
        return prisma.userClass.findMany({
            where: {
                userId,
                isDeleted: false,
            },
            select: {
                classId: true,
                role: {
                    select: {
                        roleName: true,
                    },
                },
            },
        });
    },

    findUsersByClassIds(classIds: number[]) {
        return prisma.userClass.findMany({
            where: {
                classId: { in: classIds },
                isDeleted: false,
            },
            select: {
                userId: true,
            },
        });
    },

    findTeachersByClassIds(classIds: number[]) {
        return prisma.userClass.findMany({
            where: {
                classId: { in: classIds },
                isDeleted: false,
                role: {
                    roleName: "teacher",
                },
            },
            select: {
                userId: true,
                classId: true,
            },
        });
    },

    findClassesByTeacherIds(teacherIds: number []) {
        return prisma.userClass.findMany({
            where: {
                userId: { in: teacherIds },
                isDeleted: false,
                role: {
                    roleName: "teacher",
                },
            },
            select: {
                classId: true,
            },
        });
    },

    findByUserIdAndClassId(userId: number, classId: number): Promise<UserClassPublicDTO | null> {
        return prisma.userClass.findUnique({
            where: {
                userId_classId: {
                    userId: userId,
                    classId: classId
                }
            },
            select: userClassPublicSelect
        });
    },

    async create(data: CreateUserClassDTO): Promise<UserClassPublicDTO> {
        const existing = await prisma.userClass.findUnique({
            where: {
                userId_classId: {
                    userId: data.userId,
                    classId: data.classId,
                },
            },
        });

        if (!existing) {
            return prisma.userClass.create({
                data,
                select: userClassPublicSelect,
            });
        }

        return this.update(data.userId, data.classId, data);
    },

    update(userId: number, classId: number, data: UpdateUserClassDTO): Promise<UserClassPublicDTO> {
        return prisma.userClass.update({
            where: { 
                userId_classId: {
                    userId,
                    classId
                }
            },
            data,
            select: userClassPublicSelect,
        });
    }
                
};
