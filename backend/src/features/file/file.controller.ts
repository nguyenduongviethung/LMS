import { Request, Response, NextFunction } from "express";
import { FileService } from "./file.service";
import { BadRequestError } from "../../common/errors/BadRequestError";

export const fileController = {
    async uploadFile(req: Request, res: Response, next: NextFunction) {
        if (!req.file) {
            throw new BadRequestError("No file uploaded");
        }
        const result = await FileService.uploadFile(req.file);
        res.status(201).json(result);
    }
};