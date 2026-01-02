import { CreateUserProgramSchema, UpdateUserProgramSchema } from "./userProgram.schema";
import { z } from "zod";
import { UserProgramRole } from "@prisma/client";

export interface UserProgramPublicDTO {
    userProgramId: number;
    userId: number;
    programId: number;
    role: UserProgramRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface CreateUserProgramDTO extends z.infer<typeof CreateUserProgramSchema.shape.body> { }

export interface UpdateUserProgramDTO extends z.infer<typeof UpdateUserProgramSchema.shape.body> { }