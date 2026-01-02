import { Prisma } from "@prisma/client";

export const programPublicSelect = Prisma.validator<Prisma.ProgramSelect>()({
    programId: true,
    name: true,
    description: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
