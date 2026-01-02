import { Request, Response, NextFunction } from "express";
import { ContentService } from "./content.service";

export const contentController = {
    async createContent(req: Request, res: Response, next: NextFunction) {
        const result = await ContentService.createContent(req.user!.userId, req.body);
        return res.status(201).json(result);
    },

    async updateContent(req: Request, res: Response, next: NextFunction) {
        const contentId = Number(req.params.id);
        const result = await ContentService.updateContent(req.user!.userId, contentId, req.body);
        return res.json(result);
    }
};