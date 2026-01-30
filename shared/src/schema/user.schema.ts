import { z } from "zod";
import { UserRole, UserStatus } from "../enums/user.enum";

export const CreateUserSchema = z.object({
    name: z.string().nonempty(),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(UserRole),
    status: z.enum(UserStatus),
    phone: z.string(),
    birthDate: z.date().nullable(),
    studyPlace: z.string(),
    workPlace: z.string(),
});

export const UpdateUserSchema = CreateUserSchema.omit({
    password: true
});