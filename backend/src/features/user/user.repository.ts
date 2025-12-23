import { prisma } from '../../shared/prisma/client';
import { userPublicSelect } from './user.select';
import { UserIdentity, UserPublicDTO, CreateUserDTO, UpdateUserDTO } from '@shared/src/user/user.model';

export const UserRepository = {
    async findByEmail(email: string): Promise<UserIdentity & { password: string }> {
        const user = await prisma.user.findUniqueOrThrow({
            where: { email },
            select: {
                userId: true,
                password: true,
                role: {
                    select: {
                        roleName: true,
                    },
                },
            },
        });
        return ({
            userId: user.userId,
            roleName: user.role.roleName,
            password: user.password,
        });
    },

    findByIds(userIds: number[]): Promise<UserPublicDTO[]> {
        return prisma.user.findMany({
            where: {
                userId: { in: userIds },
                isDeleted: false,
            },
            select: userPublicSelect,
        });
    },

    async findAll(): Promise<UserPublicDTO[]> {
        return prisma.user.findMany({
            where: { isDeleted: false },
            select: userPublicSelect
        });
    },

    async create(data: CreateUserDTO): Promise<UserPublicDTO> {
        return prisma.user.create({ 
            data,
            select: userPublicSelect
        });
    },

    update: async (id: number, data: UpdateUserDTO): Promise<UserPublicDTO> => {
        return prisma.user.update({
            data,
            where: { userId: id },
            select: userPublicSelect
        });
    },

    storeRefreshToken(userId: number, token: string) {
        return prisma.user.update({ where: { userId: userId }, data: { refreshToken: token } });
    },

    deleteRefreshToken(userId: number) {
        return prisma.user.update({ where: { userId: userId }, data: { refreshToken: null } });
    },

    saveOtp(email: string, otp: string) {
        return prisma.user.update({ where: { email }, data: { otp } });
    },

    verifyOtp(email: string, otp: string) {
        return prisma.user.findFirst({ where: { email, otp } });
    }
};