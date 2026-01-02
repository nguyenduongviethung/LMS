import { CreateUserClassSchema, UpdateUserClassSchema } from "./userClass.schema";
import { z } from "zod"

export interface UserClassPublicDTO {
    userId: number;
    classId: number;
    role: string;
    enrolledAt: Date;
}

export interface CreateUserClassDTO extends z.infer<typeof CreateUserClassSchema.shape.body> { }

export interface UpdateUserClassDTO extends z.infer<typeof UpdateUserClassSchema.shape.body> { }