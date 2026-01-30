import { ClassStatus } from "../enums/class.enum";
import { z } from "zod";
import { CreateClassSchema, UpdateClassSchema } from "../schema/class.schema";

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

export interface CreateClassDTO extends z.infer<typeof CreateClassSchema>{}

export interface UpdateClassDTO extends z.infer<typeof UpdateClassSchema>{}