import { Prisma } from "@prisma/client";
import { UserPublicDTO } from "./user.model";

export const userPublicSelect = {
  userId: true,
  name: true,
  email: true,
  phone: true,
  studyPlace: true,
  workPlace: true,
  roleId: true,
  stateId: true,
  createdAt: true,
} satisfies Prisma.UserSelect & Record<keyof UserPublicDTO, true>;
