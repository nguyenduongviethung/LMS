import { z } from "zod"

export const CreateSessionSchema = z.object({
    body: z.object({
        templateSessionId: z.int().positive().optional(),
        classId: z.int().positive(),
        name: z.string(),
        description: z.string().optional(),
        startTime: z.iso.datetime().optional(),
        duration: z.number().optional(),
        contents: z.object({
            create: z.array(z.object({
                contentId: z.int().positive()
            })).optional(),
        }).optional(),
    })
});

export const UpdateSessionSchema = z.object({
    body: z.object({
        templateSessionId: z.number().optional(),
        classId: z.number().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        startTime: z.iso.datetime().optional(),
        duration: z.number().optional(),
        contents: z.object({
            create: z.array(z.object({
                contentId: z.int().positive()
            })).optional(),
            delete: z.array(z.int().positive()).optional()
        }).optional(),
        deletedAt: z.date().nullable().optional()
    })
});
