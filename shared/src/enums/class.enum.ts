export const ClassStatus = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    ARCHIVED: 'ARCHIVED'
} as const;

// Type = 'OPEN' | 'CLOSED' | 'ARCHIVED'
export type ClassStatus = typeof ClassStatus[keyof typeof ClassStatus];