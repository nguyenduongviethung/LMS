import { AttendanceRepository } from "./attendance.repository";
import { SessionService } from "../session/session.service";
import { UserIdentity } from "@shared/src/types/user.types";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserClassService } from "../userClass/userClass.service";
import { AttendancePublicDTO, UpdateAttendanceDTO } from "@shared/src/types/attendance.types";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { SessionPolicy } from "@/policies/session.policy";
import { UserClassPolicy } from "@/policies/userClass.policy";

export const AttendanceService = {
    async ensureAttendance(currentUser: UserIdentity, sessionId: number): Promise<AttendancePublicDTO[]> {
        if (!await SessionPolicy.manageAttendance(currentUser, sessionId)) {
            throw new NotFoundError("SESSION.FORBIDDEN_ATTENDANCE_MANAGE");
        }
        const session = await SessionService.getById(currentUser, sessionId);
        const startTime = session.data.startTime;
        if (!startTime) {
            throw new Error("SESSION.START_TIME_NOT_SET");
        }
        const userClasses =
            await UserClassService.getByClassId(currentUser, false, session.data.class.classId, [UserClassRole.STUDENT]);

        const validUserIds = userClasses
            .filter(uc => uc.data.enrolledAt <= startTime && (uc.data.deletedAt === null || uc.data.deletedAt >= startTime))
            .map(uc => uc.data.user.userId);

        await Promise.all(validUserIds.map(userId => AttendanceRepository.upsert(sessionId, userId)));
        await AttendanceRepository.deleteInvalidAttendance(sessionId, validUserIds);
        return AttendanceRepository.findByUserIdsAndSessionIds({ sessionIds: [sessionId] });

    },

    async getSessionAttendance(currentUser: UserIdentity, sessionId: number): Promise<AttendancePublicDTO[]> {
        if (!await SessionPolicy.get(currentUser, sessionId)) {
            throw new NotFoundError("SESSION.FORBIDDEN_GET");
        }
        const attendances = await AttendanceRepository.findByUserIdsAndSessionIds({ sessionIds: [sessionId] });
        return attendances;
    },

    async getUserClassAttendance(currentUser: UserIdentity, userClassId: number): Promise<AttendancePublicDTO[]> {
        if (!await UserClassPolicy.get(currentUser, userClassId)) {
            throw new NotFoundError("USER_CLASS.FORBIDDEN_GET");
        }
        const userClass = await UserClassService.getById(currentUser, userClassId);
        if (!userClass) {
            throw new NotFoundError("USER_CLASS.NOT_FOUND");
        }
        const sessions = await SessionService.getByClassId(currentUser, userClass.data.class.classId);
        const attendances = await AttendanceRepository.findByUserIdsAndSessionIds({ userIds: [userClass.data.user.userId], sessionIds: sessions.map(session => session.data.sessionId) });
        return attendances;
    },

    async updateAttendance(currentUser: UserIdentity, sessionId: number, userId: number, data: UpdateAttendanceDTO): Promise<AttendancePublicDTO> {
        if (!await SessionPolicy.manageAttendance(currentUser, sessionId)) {
            throw new NotFoundError("SESSION.FORBIDDEN_ATTENDANCE_MANAGE");
        }
        await AttendanceRepository.upsert(sessionId, userId);
        return AttendanceRepository.updateAttendance(sessionId, userId, data);
    }
}