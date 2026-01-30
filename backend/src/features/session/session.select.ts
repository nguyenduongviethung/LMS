import { Prisma } from "@prisma/client";

export const sessionPublicSelect = Prisma.validator<Prisma.SessionSelect>()({
  sessionId: true,
  name: true,
  description: true,
  startTime: true,
  duration: true,
  createdAt: true,
  updatedAt: true,
  class: {
    select: {
      classId: true,
      name: true,
    },
  },

  // chỉ lấy _count thay vì toàn bộ content
  _count: {
    select: {
      sessionContents: true,
    },
  },

  templateSession: {
    select: {
      templateSessionId: true,
      name: true,
      description: true,
      _count: {
        select: {
          templateSessionContents: true,
        },
      },
    },
  },
});
