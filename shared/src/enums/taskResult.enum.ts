export const TaskResultStatus = {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
    OVERDUE: 'OVERDUE',
    NOT_TAKEN: 'NOT_TAKEN'
} as const;

export type TaskResultStatus = typeof TaskResultStatus[keyof typeof TaskResultStatus];