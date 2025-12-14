import { prisma } from '../../shared/prisma/client';
import { userPublicSelect } from './user.select';
import { UserIdentity } from './user.model';

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

    findById(userId: number) {
        return prisma.user.findUnique({ where: { userId } });
    },

    findByIds(userIds: number[]) {
        return prisma.user.findMany({
            where: {
                userId: { in: userIds },
                isDeleted: false,
            },
            select: userPublicSelect,
        });
    },

    findAll: async () => {
        return prisma.user.findMany({
            where: { isDeleted: false },
            select: userPublicSelect
        });
    },

    create(data: Parameters<typeof prisma.user.create>[0]['data']) {
        return prisma.user.create({ data });
    },

    update: async (id: number, data: any) => {
        return prisma.user.update({
            where: { userId: id },
            data
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