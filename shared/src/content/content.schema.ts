import { z } from "zod"

export const CreateContentSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        contentType: z.string(),
        deadline: z.iso.datetime().optional(),
        cutoffScore: z.number().optional(),
        files: z.array(z.object({
            fileId: z.int().positive(),
            roleId: z.int().positive()
        })).optional()
    })
});

export const UpdateContentSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        contentType: z.string().optional(),
        deadline: z.iso.datetime().optional(),
        cutoffScore: z.number().optional(),
        isDeleted: z.boolean().optional().default(false),
        files: z.array(z.object({
            fileId: z.int().positive(),
            roleId: z.int().positive()
        })).optional()
    })
});