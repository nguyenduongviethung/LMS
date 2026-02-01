import { ClassStatus } from '@prisma/client';
import { prisma } from '../../src/database/client';

export async function seedClasses() {

    const classes = Array.from({ length: 5 }, (_, i) => ({
        name: `Class ${i + 1}`,
        description: `Description Class ${i + 1}`,
        defaultTuition: 100000
    }));

    for (const cls of classes) {
        const existing = await prisma.class.findFirst({
            where: {
                name: cls.name,
                deletedAt: null,
            },
        });

        if (!existing) {
            await prisma.class.create({
                data: cls,
            });
        }
    }

    console.log('Seed classes completed');
}
