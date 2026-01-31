import { Prisma } from "@prisma/client";

export const filePublicSelect = Prisma.validator<Prisma.FileSelect>()({
    fileId: true,
    filename: true,
    filetype: true,
    filesize: true,
    url: true,
    uploadedAt: true,
});

export const fileDetailSelect = Prisma.validator<Prisma.FileSelect>()({
    fileId: true,
    filename: true,
    filetype: true,
    filesize: true,
    url: true,
    uploadedAt: true,
    filepath: true,
});