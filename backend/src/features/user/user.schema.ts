import { z } from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
    roleId: z.number(),
    stateId: z.number(),
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
    roleId: z.number().optional(),
    stateId: z.number().optional(),
    phone: z.string().optional(),
    birthDate: z.iso.datetime().optional(),
    studyPlace: z.string().optional(),
    workPlace: z.string().optional(),
    isDeleted: z.boolean().optional().default(false)
  })
});
