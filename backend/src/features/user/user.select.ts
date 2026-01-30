import { Prisma } from "@prisma/client";

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
    userId: true,
    name: true,
    email: true,
    phone: true,
    password: true,
    birthDate: true,
    studyPlace: true,
    workPlace: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});