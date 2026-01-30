import { Prisma } from "@prisma/client"
import { userSelect } from "../user/user.select";
import { classPublicSelect } from "../class/class.select";

export const userClassPublicSelect = Prisma.validator<Prisma.UserClassSelect>()({
    userClassId: true,
    user: {
        select: userSelect,
    },
    class: {
        select: classPublicSelect
    },
    role: true,
    enrolledAt: true,
    deletedAt: true
});