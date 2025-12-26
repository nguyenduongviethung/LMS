import { FilePublicDTO } from "../file/file.model";
import { CreateContentSchema, UpdateContentSchema } from "./content.schema";
import { z } from "zod";

export interface ContentPublicDTO {
    contentId: number;
    name: string;
    description?: string | null;
    contentType: string;
    deadline?: Date | null;
    cutoffScore?: number | null;
    contentFiles: {
        file: FilePublicDTO;
        role: {
            roleId: number;
            roleType: string;
        }
    }[];
}

export interface CreateContentDTO extends z.infer<typeof CreateContentSchema.shape.body> {}

export interface UpdateContentDTO extends z.infer<typeof UpdateContentSchema.shape.body> {}