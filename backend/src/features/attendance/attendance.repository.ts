import { AttendanceStatus } from "@shared/src/enums/attendance.enum";
import { prisma } from "../../database/client";
import { AttendancePublicDTO, UpdateAttendanceDTO } from "@shared/src/types/attendance.types";
import { attendancePublicSelect } from "./attendance.select";

export const AttendanceRepository = {
    async upsert(sessionId: number, studentId: number): Promise<AttendancePublicDTO> {
        return prisma.attendance.upsert({
            where: {
                userId_sessionId: {
                    sessionId,
                    userId: studentId
                }
            },
            create: {
                userId: studentId,
                sessionId,
                status: AttendanceStatus.NOT_TAKEN,
                note: ''
            },
            update: {},
            select: attendancePublicSelect
        })
    },

    async findByUserIdsAndSessionIds({userIds, sessionIds}: {userIds?: number[], sessionIds?: number[]}): Promise<AttendancePublicDTO[]> {
        return prisma.attendance.findMany({
            where: {
                deletedAt: null,
                ...(userIds && { userId: { in: userIds }}),
                ...(sessionIds && { sessionId: { in: sessionIds }}),
            },
            select: attendancePublicSelect,
        });
    },

    async updateAttendance(sessionId: number, studentId: number, data: UpdateAttendanceDTO): Promise<AttendancePublicDTO> {
        return prisma.attendance.update({
            where: {
                userId_sessionId: {
                    sessionId,
                    userId: studentId
                }
            },
            data,
            select: attendancePublicSelect
        })
    },

    async deleteInvalidAttendance(sessionId: number, studentIds: number[]): Promise<number> {
        return prisma.attendance.updateMany({
            where: {
                sessionId,
                userId: { notIn: studentIds},
            },
            data: {
                deletedAt: new Date()
            }
        }).then(result => result.count);
    }
};
