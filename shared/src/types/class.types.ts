import { ClassStatus } from "../enums/class.enum";

export interface ClassPublicDTO {
    classId: number;
    name: string;
    status: ClassStatus;
    description: string;
    schedules: {
        scheduleId: number;
        weekday: number;
        startTime: string;
        duration: number;
    }[];
    defaultTuition: number | null;
    createdAt: Date;
    updatedAt: Date;
}