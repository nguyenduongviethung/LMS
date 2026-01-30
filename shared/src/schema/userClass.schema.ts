import { z } from "zod"
import { UserClassRole } from "../enums/userClass.enum";

export const CreateUserClassSchema = z.object({
    userId: z.int(),
    classId: z.int(),
    role: z.enum(UserClassRole),
    enrolledAt: z.date()
});

export const UpdateUserClassSchema = CreateUserClassSchema.omit({
    userId: true,
    classId: true
});