import { Prisma } from "@prisma/client";

export const userPublicSelect = Prisma.validator<Prisma.UserSelect>()({
    userId: true,
    name: true,
    studyPlace: true,
    workPlace: true,
    role: true,
    status: true,
    userClasses: {
        select: {
            class: {
                select: {
                    name: true
                }
            },
            role: true
        }
    },
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
