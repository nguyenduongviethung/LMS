import { z } from "zod";
import { UserPublicDTO } from "./user.types";
import { ClassPublicDTO } from "./class.types";
import { UserClassRole } from "../enums/userClass.enum";
import { CreateUserClassSchema, UpdateUserClassSchema } from "../schema/userClass.schema";

export interface UserClassPublicDTO {
    userClassId: number;
    user: UserPublicDTO;
    class: ClassPublicDTO;
    role: UserClassRole;
    enrolledAt: Date;
    deletedAt: Date | null;
}

export interface CreateUserClassDTO extends z.infer<typeof CreateUserClassSchema> { }

export interface UpdateUserClassDTO extends z.infer<typeof UpdateUserClassSchema> { }