import { Request, Response } from "express";
import { FileService } from "./file.service";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";

export const fileController = {
    async uploadFile(req: Request, res: Response) {
        if (!req.file) {
            throw new BadRequestError("FILE.FILE_REQUIRED");
        }
        const result = await FileService.uploadFile(req.user!, req.file);
        res.status(201).json(result);
    },

    async downloadFile(req: Request<{ fileId: string }>, res: Response) {
        const fileId = Number(req.params.fileId);
        const file = await FileService.getById(req.user!, fileId);

        if (!file) {
            throw new NotFoundError("FILE.NOT_FOUND");
        }

        res.download(file.filepath, file.filename);
    },

    async createLink(req: Request, res: Response) {
        const { filename, url } = req.body;

        if (!filename || !url) {
            throw new BadRequestError("FILE.FILENAME_AND_URL_REQUIRED");
        }

        const result = await FileService.createLink(
            req.user!,
            { filename, url }
        );

        res.status(201).json(result);
    }
};