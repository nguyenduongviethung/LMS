import { Prisma } from "@prisma/client";
import { filePublicSelect } from "../file/file.select";

export const contentPublicSelect = Prisma.validator<Prisma.ContentSelect>()({
    contentId: true,
    name: true,
    description: true,
    deadline: true,
    cutoffScore: true,
    type: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    contentFiles: {
        select: {
            file: {
                select: filePublicSelect
            },
            role: true,
        }
    }
});
