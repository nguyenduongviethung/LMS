import { prisma } from "@/database/client";
import { userClassPublicSelect } from "./userClass.select";
import { UserClassPublicDTO } from "@shared/src/types/userClass.types";
import { UserClassRole } from "@shared/src/enums/userClass.enum";

export const UserClassRepository = {
    async findByUserIdsAndClassIds(active: boolean, userIds?: number[], classIds?: number[], userClassRoles?: UserClassRole[]): Promise<UserClassPublicDTO[]> {
        return prisma.userClass.findMany({
            where: {
                ...(userIds && { userId: { in: userIds } }),
                ...(classIds && { classId: { in: classIds } }),
                ...(active ? { deletedAt: null } : {}),
                ...(userClassRoles && { role: { in: userClassRoles} }),
                user: {
                    deletedAt: null,
                },
                class: {
                    deletedAt: null
                }
            },
            select: userClassPublicSelect,
        });
    },
};