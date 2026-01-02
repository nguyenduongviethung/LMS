import { CreateProgramSchema, UpdateProgramSchema } from "./program.schema";
import { z } from "zod";

export interface ProgramPublicDTO {
    programId: number;
    name: string;
    description?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProgramDTO extends z.infer<typeof CreateProgramSchema.shape.body>{}

export interface UpdateProgramDTO extends z.infer<typeof UpdateProgramSchema.shape.body>{}