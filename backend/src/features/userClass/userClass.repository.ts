import { prisma } from "@/database/client";
import { userClassPublicSelect } from "./userClass.select";
import { CreateUserClassDTO, UpdateUserClassDTO, UserClassPublicDTO } from "@shared/src/types/userClass.types";
import { UserClassRole } from "@shared/src/enums/userClass.enum";

export const UserClassRepository = {
    async findById(userClassId: number): Promise<UserClassPublicDTO | null> {
        return prisma.userClass.findFirst({
            where: {
                userClassId,
                deletedAt: null,
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


    async findByUserIdsAndClassIds(active: boolean, userIds?: number[], classIds?: number[], userClassRoles?: UserClassRole[]): Promise<UserClassPublicDTO[]> {
        return prisma.userClass.findMany({
            where: {
                ...(userIds && { userId: { in: userIds } }),
                ...(classIds && { classId: { in: classIds } }),
                ...(active ? { deletedAt: null } : {}),
                ...(userClassRoles && { role: { in: userClassRoles } }),
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

    async create(data: CreateUserClassDTO): Promise<UserClassPublicDTO> {
        return prisma.userClass.create({
            data,
            select: userClassPublicSelect,
        });
    },

    async update(userClassId: number, data: UpdateUserClassDTO): Promise<UserClassPublicDTO> {
        return prisma.userClass.update({
            where: {
                userClassId: userClassId,
            },
            data,
            select: userClassPublicSelect,
        });
    },

    async delete(userClassId: number): Promise<UserClassPublicDTO> {
        return prisma.userClass.update({
            where: { userClassId },
            data: { deletedAt: new Date() },
            select: userClassPublicSelect
        })
    }
};