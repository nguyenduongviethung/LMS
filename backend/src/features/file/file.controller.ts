import { Request, Response, NextFunction } from "express";
import { FileService } from "./file.service";

export const fileController = {
    async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const result = await FileService.uploadFile(req.file);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};