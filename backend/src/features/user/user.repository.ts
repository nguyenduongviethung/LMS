import { prisma } from '../../database/client';
import { userSelect } from './user.select';
import { UserIdentity, CreateUserDTO, UpdateUserDTO, UserRecord } from '@shared/src/types/user.types';

export const UserRepository = {
    async findByEmail(email: string): Promise<(UserIdentity & { password: string }) | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: userSelect,
        });
        return user ? ({
            userId: user.userId,
            role: user.role,
            name: user.name,
            email: user.email,
            password: user.password,
        }) : null;
    },

    async findById(userId: number): Promise<UserRecord | null> {
        return prisma.user.findFirst({
            where: {
                userId,
                deletedAt: null
            },
            select: userSelect,
        });
    },

    async findAll(): Promise<UserRecord[]> {
        return prisma.user.findMany({
            where: { deletedAt: null },
            select: userSelect,
            orderBy: { name: 'asc' }
        });
    },

    async create(data: CreateUserDTO): Promise<UserRecord> {
        return prisma.user.create({ 
            data,
            select: userSelect
        });
    },

    async update (userId: number, data: UpdateUserDTO): Promise<UserRecord> {
        return prisma.user.update({
            data,
            where: { userId },
            select: userSelect
        });
    },

    async delete(userId: number): Promise<UserRecord> {
        return prisma.user.update({
            data: { deletedAt: new Date()},
            where: { userId },
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