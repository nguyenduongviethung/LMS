export const FileType = {
    FILE: "FILE",
    LINK: "LINK"
} as const;

export type FileType = typeof FileType[keyof typeof FileType];