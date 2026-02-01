import { ContentType } from '@prisma/client';
import { prisma } from '../../src/database/client';

export async function seedContents() {
  const sessions = await prisma.session.findMany({
    where: { deletedAt: null },
  });

  if (sessions.length === 0) {
    console.warn('No sessions found, skip seedContents');
    return;
  }

  for (const session of sessions) {
    const contents = [
      {
        type: ContentType.LECTURE_MATERIAL,
        suffix: 'Lecture',
        description: 'Lecture materials',
        cutoffScore: null,
      },
      {
        type: ContentType.ASSIGNMENT,
        suffix: 'Assignment',
        description: 'Assignment submission',
        cutoffScore: 10,
      },
      {
        type: ContentType.HOMEWORK,
        suffix: 'Homework',
        description: 'Homework practice',
        cutoffScore: 10,
      },
      {
        type: ContentType.QUIZ,
        suffix: 'Quiz',
        description: 'Quiz assessment',
        cutoffScore: 10,
      },
    ];

    for (const cfg of contents) {
      const contentName = `${session.name} - ${cfg.suffix}`;

      // 1. Tìm content
      let content = await prisma.content.findFirst({
        where: {
          name: contentName,
          deletedAt: null,
        },
      });

      // 2. Nếu chưa có → tạo
      if (!content) {
        content = await prisma.content.create({
          data: {
            name: contentName,
            description: cfg.description,
            type: cfg.type,
            cutoffScore: cfg.cutoffScore,
            deadline:
              cfg.type === ContentType.LECTURE_MATERIAL
                ? null
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 ngày
          },
        });
      }

      // 3. Gắn vào session qua SessionContent
      const existingSessionContent =
        await prisma.sessionContent.findUnique({
          where: {
            sessionId_contentId: {
              sessionId: session.sessionId,
              contentId: content.contentId,
            },
          },
        });

      if (!existingSessionContent) {
        await prisma.sessionContent.create({
          data: {
            sessionId: session.sessionId,
            contentId: content.contentId,
          },
        });
      }
    }
  }

  console.log('Seed contents & sessionContents completed');
}
