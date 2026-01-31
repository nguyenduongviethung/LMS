import { FilePublicDTO } from "./file.types";
import { CreateContentSchema, UpdateContentSchema } from "../schema/content.schema";
import { ContentType } from "../enums/content.enum";
import { z } from "zod";
import { ContentFileRole } from "../enums/contentFile.enum";

export interface ContentPublicDTO {
    contentId: number;
    name: string;
    description: string;
    deadline: Date | null;
    cutoffScore: number | null;
    type: ContentType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    contentFiles: {
        file: FilePublicDTO;
        role: ContentFileRole;
    }[];
}

export interface CreateContentDTO extends z.infer<typeof CreateContentSchema> {}

export interface UpdateContentDTO extends z.infer<typeof UpdateContentSchema> {}