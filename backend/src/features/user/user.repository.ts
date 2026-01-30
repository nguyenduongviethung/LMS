import { CreateUserDTO, UserIdentity, UserRecord } from '@shared/src/types/user.types';
import { prisma } from '../../database/client';
import { userSelect } from './user.select';

export const UserRepository = {
    async findByEmail(email: string): Promise<(UserIdentity & { password: string }) | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                userId: true,
                role: true,
                name: true,
                email: true,
                password: true,
            }
        });
        return user ? ({
            userId: user.userId,
            role: user.role,
            name: user.name,
            email: user.email,
            password: user.password,
        }) : null;
    },

    async create(data: CreateUserDTO): Promise<UserRecord> {
        return prisma.user.create({
            data,
            select: userSelect
        });
    },

    storeRefreshToken(userId: number, token: string): Promise<UserRecord> {
        return prisma.user.update({
            where: { userId: userId },
            data: { refreshToken: token },
            select: userSelect
        });
    },

    deleteRefreshToken(userId: number): Promise<UserRecord> {
        return prisma.user.update({
            where: { userId: userId },
            data: { refreshToken: null },
            select: userSelect
        });
    },
};