import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    roleId: z.number(),
    stateId: z.number(),
    phone: z.string().optional(),
    birthDate: z.string().datetime().optional(),
    studyPlace: z.string().optional(),
    workPlace: z.string().optional(),
  })
});
