export const UserClassRole = {
  TEACHER: 'TEACHER',
  TEACHER_ASSISTANT: 'TEACHER_ASSISTANT',
  STUDENT: 'STUDENT',
} as const;

export type UserClassRole = typeof UserClassRole[keyof typeof UserClassRole];