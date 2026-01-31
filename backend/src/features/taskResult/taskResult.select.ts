import { Prisma } from "@prisma/client";
import { userSelect } from "../user/user.select";
import { contentPublicSelect } from "../content/content.select";

export const taskResultPublicSelect = Prisma.validator<Prisma.TaskResultSelect>()({
    user: {
        select: userSelect
    },
    content: {
        select: contentPublicSelect
    },
    score: true,
    status: true,
    reviews: true
});
