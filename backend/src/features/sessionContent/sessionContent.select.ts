import { Prisma } from "@prisma/client"

export const sessionContentPublicSelect = Prisma.validator<Prisma.SessionContentSelect>()({
    sessionId: true,
    contentId: true
});