import { z } from "zod"

export const CreateSessionSchema = z.object({
    body: z.object({
        templateSessionId: z.number().optional(),
        classId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        startTime: z.iso.datetime().optional(),
        duration: z.number().optional(),
        contents: z.array(z.object({
            contentId: z.number().positive()
        })).optional()
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
        isDeleted: z.boolean().optional().default(false),
        contents: z.array(z.object({
            contentId: z.number().positive()
        })).optional()
    })
});
