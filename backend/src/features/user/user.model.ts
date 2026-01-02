import { CreateUserSchema, UpdateUserSchema } from "./user.schema"
import { z } from "zod"
import { UserRole } from "@prisma/client";

export interface UserIdentity {
    userId: number;
    role: string; // admin | user | ...
}

export interface UserPublicDTO {
    userId: number;
    name: string;
    birthDate?: Date;
    studyPlace?: string | null;
    workPlace?: string | null;
    role: UserRole;
    status: string;
    userClasses: {
        class: {
            name: string;
        };
        role: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface CreateUserDTO extends z.infer<typeof CreateUserSchema.shape.body> { }

export interface UpdateUserDTO extends z.infer<typeof UpdateUserSchema.shape.body> { }
