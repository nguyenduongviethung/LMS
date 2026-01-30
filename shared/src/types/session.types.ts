import { z } from "zod";
import { CreateSessionSchema, UpdateSessionSchema } from "../schema/session.schema";

export interface SessionPublicDTO {
    sessionId: number;
    name: string;
    description: string;
    startTime: Date | null;
    duration: number | null;
    createdAt: Date;
    updatedAt: Date;
    class: {
        classId: number;
        name: string;
    };
    templateSession: {
        templateSessionId: number;
        name: string;
        description: string | null;
    } | null;
}

export interface CreateSessionDTO extends z.infer<typeof CreateSessionSchema> {}

export interface UpdateSessionDTO extends z.infer<typeof UpdateSessionSchema> {}