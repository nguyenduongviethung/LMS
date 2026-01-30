import { z } from "zod"
import { UserRole, UserStatus } from "../enums/user.enum";
import { CreateUserSchema, UpdateUserSchema } from "../schema/user.schema";

export interface UserIdentity {
    userId: number;
    role: UserRole;
    name: string;
    email: string;
}

export interface UserRecord {
    userId: number;
    name: string;
    birthDate: Date | null;
    studyPlace: string;
    workPlace: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface UserPublicDTO {
    userId: number;
    name: string;
    email?: string;
    phone?: string;
    birthDate: Date | null;
    studyPlace: string;
    workPlace: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
