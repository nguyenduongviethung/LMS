import { Prisma } from "@prisma/client";

export const classPublicSelect = Prisma.validator<Prisma.ClassSelect>()({
    classId: true,
    name: true,
    state: {
        select: {
            stateName: true
        }
    },
    description: true,
    userClasses: {
        select: {
            user: {
                select: {
                    name: true,
                    email: true,
                    role: {
                        select: {
                            roleName: true
                        }
                    },
                    createdAt: true,
                }
            }
        }
    },
    schedules: {
        select: {
            scheduleId: true,
            weekday: true,
            startTime: true,
            duration: true,
        }
    },
    defaultTuition: true,
});
