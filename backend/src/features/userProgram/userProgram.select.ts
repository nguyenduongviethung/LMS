import { Prisma } from "@prisma/client";

export const userProgramPublicSelect = Prisma.validator<Prisma.UserProgramSelect>()({
    userProgramId: true,
    userId: true,
    programId: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});