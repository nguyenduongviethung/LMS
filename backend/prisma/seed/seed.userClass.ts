import { UserClassRole } from '@prisma/client';
import { prisma } from '../../src/database/client';

export async function seedUserClasses() {
    const classes = await prisma.class.findMany({
        where: { deletedAt: null },
    });

    if (classes.length === 0) {
        console.warn('No classes found, skip seedUserClasses');
        return;
    }

    const teachers = await prisma.user.findMany({
        where: {
            email: { startsWith: 'teacher' },
            deletedAt: null,
        },
    });

    const tas = await prisma.user.findMany({
        where: {
            email: { startsWith: 'ta' },
            deletedAt: null,
        },
    });

    const students = await prisma.user.findMany({
        where: {
            email: { startsWith: 'student' },
            deletedAt: null,
        },
    });

    if (!teachers.length || !tas.length || !students.length) {
        console.warn('Missing teachers, tas or students');
        return;
    }

    let teacherIndex = 0;
    let taIndex = 0;
    let studentIndex = 0;

    for (const cls of classes) {

        /**
         * 1 TEACHER
         */
        const teacher = teachers[teacherIndex % teachers.length]!;
        teacherIndex++;

        await upsertUserClass({
            userId: teacher.userId,
            classId: cls.classId,
            role: UserClassRole.TEACHER,
        });

        /**
         * 1 TEACHER ASSISTANT
         */
        const ta = tas[taIndex % tas.length]!;
        taIndex++;

        await upsertUserClass({
            userId: ta.userId,
            classId: cls.classId,
            role: UserClassRole.TEACHER_ASSISTANT,
        });

        /**
         * 10 STUDENTS
         */
        const studentsPerClass = 10;

        for (let i = 0; i < studentsPerClass; i++) {
            const student = students[studentIndex % students.length]!;
            studentIndex++;

            await upsertUserClass({
                userId: student.userId,
                classId: cls.classId,
                role: UserClassRole.STUDENT,
            });
        }
    }

    console.log('Seed userClasses completed');
}

async function upsertUserClass(params: {
    userId: number;
    classId: number;
    role: UserClassRole;
}) {
    const { userId, classId, role } = params;

    const existing = await prisma.userClass.findFirst({
        where: {
            userId,
            classId,
            role,
            deletedAt: null,
        },
    });

    if (!existing) {
        await prisma.userClass.create({
            data: {
                userId,
                classId,
                role,
            },
        });
    }
}
