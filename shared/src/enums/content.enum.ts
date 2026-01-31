export const ContentType = {
    LECTURE_MATERIAL: 'LECTURE_MATERIAL',
    ASSIGNMENT: 'ASSIGNMENT',
    HOMEWORK: 'HOMEWORK',
    QUIZ: 'QUIZ'
} as const;

export type ContentType = typeof ContentType[keyof typeof ContentType];