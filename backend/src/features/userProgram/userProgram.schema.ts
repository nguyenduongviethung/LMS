import { z } from "zod";
import { UserProgramRole } from "@prisma/client";

export const CreateUserProgramSchema = z.object({
    body: z.object({
        userId: z.int().positive(),
        programId: z.int().positive(),
        role: z.enum(UserProgramRole)
    })
});

export const UpdateUserProgramSchema = z.object({
    body: z.object({
        role: z.enum(UserProgramRole).optional(),
        deletedAt: z.date().nullable().optional()
    })
});