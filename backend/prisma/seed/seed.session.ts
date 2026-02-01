import { prisma } from '../../src/database/client';

export async function seedSessions() {
  const classes = await prisma.class.findMany({
    where: { deletedAt: null },
  });

  if (classes.length === 0) {
    console.warn('No classes found, skip seedSessions');
    return;
  }

  for (const cls of classes) {
    const sessions = [
      {
        name: `${cls.name} - Session 1`,
        description: `Introduction for ${cls.name}`,
        startTime: null,
        duration: 90,
      },
      {
        name: `${cls.name} - Session 2`,
        description: `Deep dive for ${cls.name}`,
        startTime: null,
        duration: 90,
      },
    ];

    for (const session of sessions) {
      const existing = await prisma.session.findFirst({
        where: {
          classId: cls.classId,
          name: session.name,
          deletedAt: null,
        },
      });

      if (!existing) {
        await prisma.session.create({
          data: {
            classId: cls.classId,
            name: session.name,
            description: session.description,
            startTime: session.startTime,
            duration: session.duration,
          },
        });
      }
    }
  }

  console.log('Seed sessions completed');
}
