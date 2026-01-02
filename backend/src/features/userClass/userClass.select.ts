import { Prisma } from "@prisma/client"

export const userClassPublicSelect = Prisma.validator<Prisma.UserClassSelect>()({
    userId: true,
    classId: true,
    role: true,
    enrolledAt: true
});