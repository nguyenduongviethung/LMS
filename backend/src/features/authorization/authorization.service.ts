import { UserIdentity } from "../user/user.model";
import { UserService } from "../user/user.service";
import { UserClassService } from "../userClass/userClass.service";
import { UserClassRole } from "@prisma/client";
import { ProgramService } from "../program/program.service";
import { UserProgramService } from "../userProgram/userProgram.service";
import { UserProgramRole } from "@prisma/client";
import { ClassService } from "../class/class.service";
import { SessionService } from "../session/session.service";

export const AuthorizationService = {
    async canGetAllUsers(currentUser: UserIdentity): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        return UserClassService.getByUserId(currentUser).then(userClasses => {
            return userClasses.some(uc => uc.role === UserClassRole.TEACHER || uc.role === UserClassRole.TEACHER_ASSISTANT);
        });
    },

    async canCreateUser(currentUser: UserIdentity): Promise<boolean> {
        return UserService.isAdmin(currentUser);
    },

    async canUpdateUser(currentUser: UserIdentity, targetUserId: number) {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        return currentUser.userId === targetUserId;
    },

    async canDeleteUser(currentUser: UserIdentity, targetUserId: number): Promise<boolean> {
        if (currentUser.userId === targetUserId) {
            return false;
        }
        return UserService.isAdmin(currentUser);
    },

    async canCreateClass(currentUser: UserIdentity): Promise<boolean> {
        return UserService.isAdmin(currentUser);
    },

    async canUpdateClass(currentUser: UserIdentity, classId: number): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        return UserClassService.getByUserIdAndClassId(currentUser, classId).then(userClasses => {
            return userClasses.some(uc => uc.role === UserClassRole.TEACHER);
        });
    },

    async canDeleteClass(currentUser: UserIdentity): Promise<boolean>  {
        // return AuthorizationRepository.canDeleteClass(userId);
        return UserService.isAdmin(currentUser);
    },

    async canManageUserClass(currentUser: UserIdentity, userClassId: number): Promise<boolean> {
        // return AuthorizationRepository.canManageUserClass(userId, userClassId);
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        return UserClassService.getById(userClassId).then(uc => {
            if (!uc) return false;
            return this.canUpdateClass(currentUser, uc.classId);
        });      
    },

    async canGetSession(currentUser: UserIdentity, sessionId: number): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        const classes = await ClassService.getBySessionId(sessionId);
        const allowedClassIds = await ClassService.getAllowedClassIds(currentUser);
        return classes.some(c => allowedClassIds.includes(c.classId));
    },

    async canManageSession(currentUser: UserIdentity, classId: number): Promise<boolean> {
        return this.canUpdateClass(currentUser, classId);
    },

    async canCreateProgram(currentUser: UserIdentity): Promise<boolean> {
        return UserService.isAdmin(currentUser);
    },

    async canUpdateProgram(currentUser: UserIdentity, programId: number): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        return UserProgramService.getByUserIdAndProgramId(currentUser.userId, programId).then(userPrograms => {
            return userPrograms.some(up => up.role === UserProgramRole.OWNER || up.role === UserProgramRole.EDITOR);
        });
    },

    async canDeleteProgram(currentUser: UserIdentity): Promise<boolean> {
        return UserService.isAdmin(currentUser);
    },

    async canManageUserProgram(currentUser: UserIdentity, programId: number): Promise<boolean> {
        return this.canUpdateProgram(currentUser, programId);
    },

    async canManageTemplateSession(currentUser: UserIdentity, templateSessionId: number): Promise<boolean> {
        return this.canUpdateProgram(currentUser, templateSessionId);
    },

    async canCreateContent(currentUser: UserIdentity): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        const userClasses = await UserClassService.getByUserId(currentUser);
        if (userClasses.some(uc => uc.role === UserClassRole.TEACHER)) {
            return true;
        }
        const userPrograms = await UserProgramService.getByUserId(currentUser.userId);
        return userPrograms.length > 0;
    },

    async canUpdateContent(currentUser: UserIdentity, contentId: number): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        const classes = await ClassService.getByContentId(contentId);
        const classRoles = await Promise.all(classes.map(c => 
            UserClassService.getByUserIdAndClassId(currentUser, c.classId)
        ));
        if (classRoles.some(rList => rList.some(r => r.role === UserClassRole.TEACHER))) {
            return true;
        }
        const programs = await ProgramService.getByContentId(contentId);
        const programRoles = await Promise.all(programs.map(p => 
            UserProgramService.getByUserIdAndProgramId(currentUser.userId, p.programId)
        ));
        return programRoles.some(rList => rList.some(r => r.role === UserProgramRole.OWNER || r.role === UserProgramRole.EDITOR));
    },

    async canManageTemplateSessionContent(currentUser: UserIdentity, templateSessionId: number): Promise<boolean> {
        const programs = await ProgramService.getByTemplateSessionId(templateSessionId);
        return programs.some(async program =>
            this.canUpdateProgram(currentUser, program.programId)
        );
    },

    async canCreateFile(currentUser: UserIdentity): Promise<boolean> {
        return this.canCreateContent(currentUser);
    },

    async canManageSchedule(currentUser: UserIdentity, classId: number): Promise<boolean> {
        return this.canUpdateClass(currentUser, classId);
    },

    async canManageAttendance(currentUser: UserIdentity, sessionId: number): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        const classes = await ClassService.getBySessionId(sessionId);
        const classRoles = await Promise.all(classes.map(c => 
            UserClassService.getByUserIdAndClassId(currentUser, c.classId)
        ));
        return classRoles.some(rList => rList.some(r => r.role === UserClassRole.TEACHER || r.role === UserClassRole.TEACHER_ASSISTANT));
    },

    async canManageTaskResults(currentUser: UserIdentity, contentId: number): Promise<boolean> {
        if (await UserService.isAdmin(currentUser)) {
            return true;
        }
        const sessions = await SessionService.getByContentId(contentId);
        const classIds = sessions.map(s => s.class.classId);
        const classRoles = await Promise.all(classIds.map(classId => 
            UserClassService.getByUserIdAndClassId(currentUser, classId)
        ));
        return classRoles.some(rList => rList.some(r => r.role === UserClassRole.TEACHER || r.role === UserClassRole.TEACHER_ASSISTANT));
    }
};
