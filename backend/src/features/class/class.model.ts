import { CreateClassSchema, UpdateClassSchema } from "./class.schema";
import { z } from "zod"

export interface ClassPublicDTO {
    classId: number;
    name: string;
    status: string;
    description?: string | null;
    userClasses: {
        user: {
            name: string;
            email: String;
            role: string;
            createdAt: Date;
        },
    }[];
    schedules: {
        scheduleId: number;
        weekday: number;
        startTime: string;
        duration: number;
    }[];
    defaultTuition?: number | null;
}

export interface CreateClassDTO extends z.infer<typeof CreateClassSchema.shape.body>{}


export interface UpdateClassDTO extends z.infer<typeof UpdateClassSchema.shape.body>{}