import { prisma } from "../../shared/prisma/client";

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
    }
};
