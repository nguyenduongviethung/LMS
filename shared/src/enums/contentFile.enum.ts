export const ContentFileRole = {
    LESSON_FILE: "LESSON_FILE",
    CORRECTION_FILE: "CORRECTION_FILE",
    SUBMISSION_LINK: "SUBMISSION_LINK",
} as const;

export type ContentFileRole = typeof ContentFileRole[keyof typeof ContentFileRole];
