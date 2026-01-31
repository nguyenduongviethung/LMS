import { Prisma } from "@prisma/client";
import { filePublicSelect } from "../file/file.select";

export const contentFilePublicSelect = Prisma.validator<Prisma.ContentFileSelect>()({
    contentId: true,
    file: {
        select: filePublicSelect,
    },
    role: true,
});