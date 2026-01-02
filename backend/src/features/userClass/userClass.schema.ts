import { z } from "zod"
import { UserClassRole } from "@prisma/client";

export const CreateUserClassSchema = z.object({
    body: z.object({
        userId: z.int(),
        classId: z.int(),
        role: z.enum(UserClassRole)
    })
});

export const UpdateUserClassSchema = z.object({
    body: z.object({
        role: z.enum(UserClassRole).optional(),
        deletedAt: z.date().nullable().optional()
    })
});