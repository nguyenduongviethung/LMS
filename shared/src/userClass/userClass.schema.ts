import { z } from "zod"

export const CreateUserClassSchema = z.object({
    body: z.object({
        userId: z.int(),
        classId: z.int(),
        roleId: z.int(),
        stateId: z.int()
    })
});

export const UpdateUserClassSchema = z.object({
    body: z.object({
        userId: z.int().optional(),
        classId: z.int().optional(),
        roleId: z.int().optional(),
        stateId: z.int().optional(),
        isDeleted: z.boolean().optional()
    })
});