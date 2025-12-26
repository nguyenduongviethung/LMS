import { Prisma } from "@prisma/client";

export const filePublicSelect = Prisma.validator<Prisma.FileSelect>()({
    fileId: true,
    filename: true,
    filetype: true,
    filesize: true,
    uploadedAt: true,
});