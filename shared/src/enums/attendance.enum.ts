export const AttendanceStatus = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    NOT_TAKEN: 'NOT_TAKEN'
} as const;

export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];