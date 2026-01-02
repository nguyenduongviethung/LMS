import { AuthorizationRepository } from "./authorization.repository";

export const AuthorizationService = {
    async canGetAllUsers(userId: number) {
        return AuthorizationRepository.canGetAllUsers(userId);
    },
    async canCreateUser(userId: number) {
        return AuthorizationRepository.canCreateUser(userId);
    },
    async canUpdateUser(userId: number, targetUserId: number) {
        return AuthorizationRepository.canUpdateUser(userId, targetUserId);
    },
    async canDeleteUser(userId: number, targetUserId: number) {
        return AuthorizationRepository.canDeleteUser(userId, targetUserId);
    },
    async canCreateClass(userId: number) {
        return AuthorizationRepository.canCreateClass(userId);
    },
    async canUpdateClass(userId: number, classId: number) {
        return AuthorizationRepository.canUpdateClass(userId, classId);
    },
    async canDeleteClass(userId: number) {
        return AuthorizationRepository.canDeleteClass(userId);
    },
    async canManageUserClass(userId: number, userClassId: number) {
        return AuthorizationRepository.canManageUserClass(userId, userClassId);
    },
    async canManageSession(userId: number, classId: number) {
        return AuthorizationRepository.canManageSession(userId, classId);
    },
    async canCreateProgram(userId: number) {
        return AuthorizationRepository.canCreateProgram(userId);
    },
    async canUpdateProgram(userId: number, programId: number) {
        return AuthorizationRepository.canUpdateProgram(userId, programId);
    },
    async canDeleteProgram(userId: number) {
        return AuthorizationRepository.canDeleteProgram(userId);
    },
    async canManageUserProgram(userId: number, programId: number) {
        return AuthorizationRepository.canManageUserProgram(userId, programId);
    },
    async canManageTemplateSession(userId: number, templateSessionId: number) {
        return AuthorizationRepository.canManageTemplateSession(userId, templateSessionId);
    },
    async canCreateContent(userId: number) {
        return AuthorizationRepository.canCreateContent(userId);
    },
    async canUpdateContent(userId: number, contentId: number) {
        return AuthorizationRepository.canUpdateContent(userId, contentId);
    },
    async canManageSessionContent(userId: number, sessionId: number) {
        return AuthorizationRepository.canManageSessionContent(userId, sessionId);
    },
    async canManageTemplateSessionContent(userId: number, templateSessionId: number) {
        return AuthorizationRepository.canManageTemplateSessionContent(userId, templateSessionId);
    },
    async canCreateFile(userId: number) {
        return AuthorizationRepository.canCreateFile(userId);
    },
    async canUpdateFile(userId: number, fileId: number) {
        return AuthorizationRepository.canUpdateFile(userId, fileId);
    },
    async canManageContentFile(userId: number, contentId: number) {
        return AuthorizationRepository.canManageContentFile(userId, contentId);
    },
    async canManageSchedule(userId: number, classId: number) {
        return AuthorizationRepository.canManageSchedule(userId, classId);
    },
    async canManageAttendance(userId: number, classId: number) {
        return AuthorizationRepository.canManageAttendance(userId, classId);
    },
    async canManageTaskResults(userId: number, classId: number) {
        return AuthorizationRepository.canManageTaskResults(userId, classId);
    }
};
