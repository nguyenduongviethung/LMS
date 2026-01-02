import { z } from "zod"
import { ProgramStatus } from "@prisma/client";

export const CreateProgramSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        status: z.enum(ProgramStatus).optional()
    })
});

export const UpdateProgramSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(ProgramStatus).optional(),
        deletedAt: z.date().nullable().optional()
    })
});