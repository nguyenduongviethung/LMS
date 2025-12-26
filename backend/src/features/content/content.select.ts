import { Prisma } from "@prisma/client";
import { filePublicSelect } from "../file/file.select";

export const contentPublicSelect = Prisma.validator<Prisma.ContentSelect>()({
    contentId: true,
    name: true,
    description: true,
    contentType: true,
    deadline: true,
    cutoffScore: true,
    contentFiles: {
        select: {
            file: {
                select: filePublicSelect
            },
            role: {
                select: {
                    roleId: true,
                    roleType: true
                }
            }
        }
    }
});
