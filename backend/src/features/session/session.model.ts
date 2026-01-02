import { z } from "zod";
import { CreateSessionSchema, UpdateSessionSchema } from "../../../../shared/src/session/session.schema";

export interface SessionPublicDTO {
    sessionId: number;
    name: string;
    description?: string | null;
    startTime?: Date | null;
    duration?: number | null;
    createdAt: Date;
    updatedAt: Date;
    class: {
        classId: number;
        name: string;
    };
    sessionContents: {
        content: {
            contentId: number;
            name: string;
            contentType: string;
        };
    }[];
    templateSession?: {
        templateSessionId: number;
        name: string;
        description?: string | null;
        templateSessionContents: {
            content: {
                contentId: number;
                name: string;
                contentType: string;
            };
        }[];
    } | null;
}

export interface CreateSessionDTO extends z.infer<typeof CreateSessionSchema.shape.body> {}

export interface UpdateSessionDTO extends z.infer<typeof UpdateSessionSchema.shape.body> {}