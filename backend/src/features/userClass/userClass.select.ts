import { Prisma } from "@prisma/client"

export const userClassPublicSelect = Prisma.validator<Prisma.UserClassSelect>()({
    userId: true,
    classId: true,
    
    role: {
        select: {
            roleId: true,
            roleName: true
        }
    },

    state: {
        select: {
            stateId: true,
            stateName: true
        }
    },

    enrolledAt: true
});