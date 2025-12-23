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
            description?: string | null;
            contentType: string;
            deadline?: Date | null;
            cutoffScore?: number | null;
            contentFiles: {
                file: {
                    fileId: number;
                    filename: string;
                    filetype: string;
                    filesize: number;
                    uploadedAt: Date;
                };
            }[];
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
                description?: string | null;
                contentType: string;
                deadline?: Date | null;
                cutoffScore?: number | null;
                contentFiles: {
                    file: {
                        fileId: number;
                        filename: string;
                        filetype: string;
                        filesize: number;
                        uploadedAt: Date;
                    };
                }[];
            };
        }[];
    } | null;
}