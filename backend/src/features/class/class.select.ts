import { Prisma } from "@prisma/client";

export const classPublicSelect = Prisma.validator<Prisma.ClassSelect>()({
    classId: true,
    name: true,
    status: true,
    description: true,
    schedules: {
        select: {
            scheduleId: true,
            weekday: true,
            startTime: true,
            duration: true,
        }
    },
    defaultTuition: true,
    createdAt: true,
    updatedAt: true,
});
