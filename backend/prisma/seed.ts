import 'dotenv/config';
import { prisma } from '../src/shared/prisma/client';
import bcrypt from 'bcrypt';

async function main() {
    const saltRounds = 10;

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    // Kiểm tra nếu admin đã tồn tại thì không tạo nữa
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@gmail.com' },
    });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: 'admin@gmail.com',
                name: 'Admin',
                role: 'ADMIN',
                password: hashedPassword,
            },
        });

        console.log('Seed admin user thành công');
    } else {
        console.log('Admin user đã tồn tại, bỏ qua seed');
    }
}

// Chạy seed
main()
    .catch((e) => {
        console.error('Lỗi seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
