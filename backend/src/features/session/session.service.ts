import { SessionRepository } from "./session.repository";
import { UserIdentity } from "@shared/src/user/user.model";
import { userClassRepository } from "../userClass/userClass.repository";
import { ClassService } from "../class/class.service";

export const sessionService = {
    // async createSession(payload: CreateSessionDTO, currentUser: UserIdentity) {
    //     // check permission
    //     const allowedClassIds = await userClassRepository.findAllowedClassIdsByUserId(currentUser.userId);
    //     if (!allowedClassIds.includes(payload.classId)) {
    //         throw new Error("Unauthorized to create session for this class");
    //     }
    //     return SessionRepository.create({
    //         ...payload,
    //         isDeleted: false,
    //     } as any);
    // },

    async getSessions(currentUser: UserIdentity) {
        const allowedClassIds = await ClassService.getAllowedClassIds(currentUser);
        return SessionRepository.findByClassIds(allowedClassIds);
    },

    // async updateSession(sessionId: number, payload: UpdateSessionDTO, currentUser: UserIdentity) {
    //     // check permission
    //     const session = await SessionRepository.findById(sessionId);
    //     if (!session) {
    //         throw new Error("Session not found");
    //     }
    //     const allowedClassIds = await userClassRepository.findAllowedClassIdsByUserId(currentUser.userId);
    //     if (!allowedClassIds.includes(session.classId)) {
    //         throw new Error("Unauthorized to update this session");
    //     }
    //     return SessionRepository.update(sessionId, payload);
    // },

    // async deleteSession(sessionId: number, currentUser: UserIdentity) {
    //     // check permission
    //     const session = await SessionRepository.findById(sessionId);
    //     if (!session) {
    //         throw new Error("Session not found");
    //     }
    //     const allowedClassIds = await userClassRepository.findAllowedClassIdsByUserId(currentUser.userId);
    //     if (!allowedClassIds.includes(session.classId)) {
    //         throw new Error("Unauthorized to delete this session");
    //     }
    //     return SessionRepository.delete(sessionId);
    // }
};