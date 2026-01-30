import { z } from "zod"
import { ClassStatus } from "../enums/class.enum";

export const CreateClassSchema = z.object({
    status: z.enum(ClassStatus),
    name: z.string().nonempty(),
    description: z.string(),
    defaultTuition: z.number().nullable()
});

export const UpdateClassSchema = CreateClassSchema;