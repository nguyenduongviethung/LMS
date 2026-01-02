import { z } from "zod"

export const CreateClassSchema = z.object({
    body: z.object({
        stateId: z.int(),
        name: z.string(),
        description: z.string().optional(),
        defaultTuition: z.number().optional()
    })
});

export const UpdateClassSchema = z.object({
    body: z.object({
        stateId: z.int().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        defaultTuition: z.number().optional(),
        deletedAt: z.date().nullable().optional()
    })
});