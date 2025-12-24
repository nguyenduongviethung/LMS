import { CreateUserSchema, UpdateUserSchema } from "./user.schema"
import { z } from "zod"

export interface UserIdentity {
  userId: number;
  roleName: string; // admin | user | ...
}

export interface UserPublicDTO {
  userId: number;
  name: string;
  email: string;
  phone?: string | null;
  birthDate?: Date;
  studyPlace?: string | null;
  workPlace?: string | null;
  role: {
    roleName: string;
  };
  state: {
    stateName: string;
  };
  userClasses: {
    class: {
      name: string;
    };
    role: {
      roleName: string;
    }
  }[];
  createdAt: Date;
}

export interface CreateUserDTO extends z.infer<typeof CreateUserSchema.shape.body>{}

export interface UpdateUserDTO extends z.infer<typeof UpdateUserSchema.shape.body>{}
