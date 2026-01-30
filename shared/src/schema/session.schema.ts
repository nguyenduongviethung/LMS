import { z } from "zod"

export const CreateSessionSchema = z.object({
    templateSessionId: z.int().positive().nullable(),
    classId: z.int().positive(),
    name: z.string(),
    description: z.string(),
    startTime: z.date().nullable(),
    duration: z.number().nullable()
});

export const UpdateSessionSchema = CreateSessionSchema;
