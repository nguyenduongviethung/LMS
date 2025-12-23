import { Prisma } from "@prisma/client";

export const sessionPublicSelect = Prisma.validator<Prisma.SessionSelect>()({
    sessionId: true,
    name: true,
    description: true,
    startTime: true,
    duration: true,
    createdAt: true,
    updatedAt: true,
    class: {
        select: {
            classId: true,
            name: true,
        }
    },
    sessionContents: {
        select: {
            content: {
                select: {
                    contentId: true,
                    name: true,
                    description: true,
                    contentType: true,
                    deadline: true,
                    cutoffScore: true,
                    contentFiles: {
                        select: {
                            file: {
                                select: {
                                    fileId: true,
                                    filename: true,
                                    filetype: true,
                                    filesize: true,
                                    uploadedAt: true
                                }
                            }
                        }
                    }
                }
            }
        }
    },
            
    templateSession: {
        select: {
            templateSessionId: true,
            name: true,
            description: true,
            templateSessionContents: {
                select: {
                    content: {
                        select: {
                            contentId: true,
                            name: true,
                            description: true,
                            contentType: true,
                            deadline: true,
                            cutoffScore: true,
                            contentFiles: {
                                select: {
                                    file: {
                                        select: {
                                            fileId: true,
                                            filename: true,
                                            filetype: true,
                                            filesize: true,
                                            uploadedAt: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});