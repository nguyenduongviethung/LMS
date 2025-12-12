import { prisma } from '../shared/prisma/client';

export const UserRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },

    findById(userId: number) {
        return prisma.user.findUnique({ where: { userId } });
    },

    create(data: Parameters<typeof prisma.user.create>[0]['data']) {
        return prisma.user.create({ data });
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
