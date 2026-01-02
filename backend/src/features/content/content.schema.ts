import { z } from "zod"
import { ContentFileRole } from "@prisma/client"

export const CreateContentSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        contentType: z.string(),
        deadline: z.iso.datetime().optional(),
        cutoffScore: z.number().optional(),
        files: z.object({
            create: z.array(z.object({
                fileId: z.int().positive(),
                role: z.enum(ContentFileRole)
            })).optional()
        }).optional()
    })
});

export const UpdateContentSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        contentType: z.string().optional(),
        deadline: z.iso.datetime().optional(),
        cutoffScore: z.number().optional(),
        deletedAt: z.iso.datetime().optional(),
        files: z.object({
            create: z.array(z.object({
                fileId: z.int().positive(),
                role: z.enum(ContentFileRole)
            })).optional(),
            update: z.array(z.object({
                fileId: z.int().positive(),
                role: z.enum(ContentFileRole)
            })).optional(),
            delete: z.array(z.int().positive()).optional()
        }).optional()
    })
});