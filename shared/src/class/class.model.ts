export interface ClassPublicDTO {
    classId: number;
    name: string;
    state: {
        stateName: string;
    };
    description?: string | null;
    userClasses: {
        user: {
            name: string;
            email: String;
            role: {
                roleName: string;
            },
            createdAt: Date;
        },
    }[];
    schedules: {
        scheduleId: number;
        weekday: number;
        startTime: string;
        duration: number;
    }[];
    defaultTuition?: number | null;
}

export interface CreateClassDTO {
    stateId: number;
    name: string;
    description?: string;
    defaultTuition?: number;
}


export interface UpdateClassDTO {
    stateId?: number;
    name?: string;
    description?: string | null;
    defaultTuition?: number | null;
    isDeleted?: boolean;
}