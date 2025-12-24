import { Prisma } from "@prisma/client";

export const userPublicSelect = Prisma.validator<Prisma.UserSelect>()({
    userId: true,
    name: true,
    email: true,
    phone: true,
    studyPlace: true,
    workPlace: true,
    role: {
        select: {
            roleName: true
        }
    },
    state: {
        select: {
            stateName: true
        }
    },
    userClasses: {
        select: {
            class: {
                select: {
                    name: true
                }
            },
            role: {
                select: {
                    roleName: true
                }
            }
        }
    },
    createdAt: true,
});
