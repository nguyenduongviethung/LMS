import { Prisma } from "@prisma/client";
import { userSelect } from "../user/user.select";
import { sessionPublicSelect } from "../session/session.select";

export const attendancePublicSelect = Prisma.validator<Prisma.AttendanceSelect>()({
    user: {
        select: userSelect
    },
    session: {
        select: sessionPublicSelect
    },
    status: true,
    note: true,
});
