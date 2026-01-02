import { UserClassRole, UserProgramRole, UserRole } from "@prisma/client";
import { prisma } from "backend/src/shared/prisma/client";

export const AuthorizationRepository = {
    async isAdmin(userId: number): Promise<boolean> {
        const user = await prisma.user.findUniqueOrThrow({
            where: { userId },
            select: {
                role: true,
            },
        });
        return user.role === UserRole.ADMIN;
    },

    async isTeacher(userId: number): Promise<boolean> {
        const user = await prisma.user.findUniqueOrThrow({
            where: { userId },
            select: {
                userClasses: {
                    select: {
                        role: true,
                    },
                },
            },
        });
        return user.userClasses.some(uc => uc.role === UserClassRole.TEACHER);
    },

    async isInProgram(userId: number): Promise<boolean> {
        const user = await prisma.user.findUniqueOrThrow({
            where: { userId },
            select: {
                userPrograms: {
                    select: {
                        programId: true,
                    },
                },
            },
        });
        return user.userPrograms.length > 0;
    },

    async rolesInClass(userId: number, classId: number): Promise<string[]> {
        const userClass = await prisma.userClass.findMany({
            where: {
                userId,
                classId,
                deletedAt: null
            },
            select: {
                role: true,
            },
        });
        return userClass.map(uc => uc.role);
    },

    async rolesInProgram(userId: number, programId: number): Promise<string[]> {
        const userProgram = await prisma.userProgram.findMany({
            where: {
                userId,
                programId,
                deletedAt: null
            },
            select: {
                role: true,
            },
        });
        return userProgram.map(up => up.role);
    },

    async canGetAllUsers(userId: number): Promise<boolean> {
        if (await this.isAdmin(userId)) {
            return true;
        }
        const user = await prisma.user.findUniqueOrThrow({
            where: { userId },
            select: {
                userClasses: {
                    select: {
                        role: true,
                    },
                },
            },
        });
        if (user.userClasses.every(uc => uc.role !== UserClassRole.TEACHER && uc.role !== UserClassRole.TEACHER_ASSISTANT)) {
            return false;
        }
        return true;
    },  

    async canCreateUser(userId: number): Promise<boolean> {
        return this.isAdmin(userId);
    },

    async canUpdateUser(userId: number, targetUserId: number): Promise<boolean> {
        if (userId === targetUserId) {
            return true; // Users can update their own profile
        }
        return this.isAdmin(userId);
    },

    async canDeleteUser(userId: number, targetUserId: number): Promise<boolean> {
        if (userId === targetUserId) {
            return false; // Users cannot delete their own profile
        }
        return this.isAdmin(userId);
    },

    async canCreateClass(userId: number): Promise<boolean> {
        return this.isAdmin(userId);
    },

    async canUpdateClass(userId: number, classId: number): Promise<boolean> {
        if (await this.isAdmin(userId)) {
            return true;
        }
        const roles = await this.rolesInClass(userId, classId);
        return roles.includes(UserClassRole.TEACHER);
    },

    async canDeleteClass(userId: number): Promise<boolean> {
        return this.isAdmin(userId);
    },

    async canManageUserClass(userId: number, userClassId: number): Promise<boolean> {
        const userClass = await prisma.userClass.findUniqueOrThrow({
            where: { userClassId },
            select: {
                classId: true,
                userId: true,
            },
        });
        return this.canUpdateClass(userId, userClass.classId);
    },

    async canManageSession(userId: number, classId: number): Promise<boolean> {
        return this.canUpdateClass(userId, classId);
    },

    async canCreateProgram(userId: number): Promise<boolean> {
        return this.isAdmin(userId);
    },

    async canUpdateProgram(userId: number, programId: number): Promise<boolean> {
        if (await this.isAdmin(userId)) {
            return true;
        }
        const roles = await this.rolesInProgram(userId, programId);
        return roles.includes('OWNER') || roles.includes('EDITOR');
    },

    async canDeleteProgram(userId: number): Promise<boolean> {
        return this.isAdmin(userId);
    },

    async canManageUserProgram(userId: number, programId: number): Promise<boolean> {
        return this.canUpdateProgram(userId, programId);
    },

    async canManageTemplateSession(userId: number, programId: number): Promise<boolean> {
        return this.canUpdateProgram(userId, programId);
    },

    async canCreateContent(userId: number): Promise<boolean> {
        if (await this.isAdmin(userId)) {
            return true;
        }
        if (await this.isTeacher(userId)) {
            return true;
        }
        if (await this.isInProgram(userId)) {
            return true;
        }
        return false;
    },

    async canUpdateContent(userId: number, contentId: number): Promise<boolean> {
        if (await this.isAdmin(userId)) {
            return true;
        }
        const sessionId = await prisma.content.findUniqueOrThrow({
            where: { contentId },
            select: {
                sessionContents: {
                    select: {
                        session: {
                            select: {
                                class: {
                                    select: {
                                        classId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }).then(content => content.sessionContents[0]?.session.class.classId);
        if (sessionId) {
            const roles = await this.rolesInClass(userId, sessionId);
            if (roles.includes(UserClassRole.TEACHER)) {
                return true;
            }
        }
        const programId = await prisma.content.findUniqueOrThrow({
            where: { contentId },
            select: {
                templateSessionContents: {
                    select: {
                        templateSession: {
                            select: {
                                program: {
                                    select: {
                                        programId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }).then(content => content.templateSessionContents[0]?.templateSession.program.programId);
        if (programId) {
            const roles = await this.rolesInProgram(userId, programId);
            if (roles.includes(UserProgramRole.OWNER) || roles.includes(UserProgramRole.EDITOR)) {
                return true;
            }
        }
        return false;
    },

    async canManageSessionContent(userId: number, sessionId: number) {
        return this.canManageSession(userId, sessionId)
    },

    async canManageTemplateSessionContent(userId: number, templateSessionId: number) {
        const programId = await prisma.templateSession.findUniqueOrThrow({
            where: { templateSessionId },
            select: {
                program: {
                    select: {
                        programId: true,
                    },
                },
            },
        }).then(templateSession => templateSession.program.programId);
        return this.canManageTemplateSession(userId, programId);
    },

    async canCreateFile(userId: number) {
        return this.canCreateContent(userId);
    },

    async canUpdateFile(userId: number, fileId: number) {
        const contentId = await prisma.file.findUniqueOrThrow({
            where: { fileId },
            select: {
                contentFiles: {
                    select: {
                        contentId: true,
                    }
                }
            }
        }).then(file => file.contentFiles[0]?.contentId);
        return this.canUpdateContent(userId, contentId);
    },

    async canManageContentFile(userId: number, contentId: number) {
        return this.canUpdateContent(userId, contentId);
    },

    async canManageSchedule(userId: number, classId: number) {
        return this.canUpdateClass(userId, classId);
    },

    async canManageAttendance(userId: number, sessionId: number) {
        // admin
        if (await this.isAdmin(userId)) {
            return true;
        }
        // find classId from sessionId
        const classId = await prisma.session.findUniqueOrThrow({
            where: { sessionId },
            select: {
                class: {
                    select: {
                        classId: true,
                    },
                },
            },
        }).then(session => session.class.classId);
        const roles = await this.rolesInClass(userId, classId);
        return roles.includes(UserClassRole.TEACHER) || roles.includes(UserClassRole.TEACHER_ASSISTANT);
    },

    async canManageTaskResults(userId: number, contentId: number) {
        // admin
        if (await this.isAdmin(userId)) {
            return true;
        }

        // find classId from contentId
        const sessionId = await prisma.content.findUniqueOrThrow({
            where: { contentId },
            select: {
                sessionContents: {
                    select: {
                        session: {
                            select: {
                                class: {
                                    select: {
                                        classId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }).then(content => content.sessionContents[0]?.session.class.classId);
        if (sessionId) {
            const roles = await this.rolesInClass(userId, sessionId);
            return roles.includes(UserClassRole.TEACHER) || roles.includes(UserClassRole.TEACHER_ASSISTANT);
        }
        return false;
    }
};
