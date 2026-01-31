import { Prisma } from "@prisma/client"
import { sessionPublicSelect } from "../session/session.select";
import { contentPublicSelect } from "../content/content.select";

export const sessionContentPublicSelect = Prisma.validator<Prisma.SessionContentSelect>()({
    session: {
        select: sessionPublicSelect
    },
    content: {
        select: contentPublicSelect
    }
});