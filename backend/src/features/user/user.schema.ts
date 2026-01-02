import { z } from "zod";
import { UserRole, UserStatus } from "@prisma/client";

export const CreateUserSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6),
        role: z.enum(UserRole).optional(),
        status: z.enum(UserStatus).optional(),
        phone: z.string().optional(),
        birthDate: z.iso.datetime().optional(),
        studyPlace: z.string().optional(),
        workPlace: z.string().optional(),
    })
});

export const UpdateUserSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(UserRole).optional(),
        status: z.enum(UserStatus).optional(),
        phone: z.string().optional(),
        birthDate: z.iso.datetime().optional(),
        studyPlace: z.string().optional(),
        workPlace: z.string().optional(),
        deletedAt: z.date().nullable().optional(),
    })
});
