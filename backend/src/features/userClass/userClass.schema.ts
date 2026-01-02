import { z } from "zod"
import { UserClassRole } from "@prisma/client";

export const CreateUserClassSchema = z.object({
    body: z.object({
        userId: z.int(),
        classId: z.int(),
        roleId: z.int(),
        stateId: z.int()
    })
});

export const UpdateUserClassSchema = z.object({
    body: z.object({
        role: z.enum(UserClassRole).optional(),
        deletedAt: z.date().nullable().optional()
    })
});