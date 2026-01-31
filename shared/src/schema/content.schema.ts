import { z } from "zod"
import { ContentType } from "../enums/content.enum";
import { ContentFileRole } from "../enums/contentFile.enum";
import { FileType } from "../enums/file.enum";

export const CreateContentSchema = z.object({
    name: z.string(),
    description: z.string(),
    deadline: z.date().nullable(),
    cutoffScore: z.number().nullable(),
    type: z.enum(ContentType),
    contentFiles: z.array(z.object({
        file: z.object({
            fileId: z.int().positive(),
            filename: z.string(),
            filetype: z.enum(FileType),
            filesize: z.number().nullable(),
            url: z.string(),
            uploadedAt: z.coerce.date(),
        }),
        role: z.enum(ContentFileRole)
    }))
});

export const UpdateContentSchema = CreateContentSchema