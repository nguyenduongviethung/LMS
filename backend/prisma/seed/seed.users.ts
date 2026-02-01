import { UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../../src/database/client';

const DEFAULT_PASSWORD = '123456';

export async function seedUsers() {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const admins = [
        {
            email: 'admin@lms.local',
            name: 'Admin',
            role: UserRole.ADMIN,
        },
    ];

    const teachers = Array.from({ length: 5 }, (_, i) => ({
        email: `teacher${i + 1}@lms.local`,
        name: `Teacher ${i + 1}`,
        role: UserRole.USER,
    }));

    const tas = Array.from({ length: 5 }, (_, i) => ({
        email: `ta${i + 1}@lms.local`,
        name: `TA ${i + 1}`,
        role: UserRole.USER,
    }));

    const students = Array.from({ length: 20 }, (_, i) => ({
        email: `student${i + 1}@lms.local`,
        name: `Student ${i + 1}`,
        role: UserRole.USER,
    }));

    const users = [
        ...admins,
        ...teachers,
        ...tas,
        ...students,
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                name: user.name,
                role: user.role,
                status: UserStatus.ACTIVE,
                password: passwordHash,
                phone: '',
                studyPlace: '',
                workPlace: '',
            },
        });
    }

    console.log('Seed users completed');
}
