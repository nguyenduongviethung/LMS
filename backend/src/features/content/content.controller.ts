import { Request, Response } from "express";
import { ContentService } from "./content.service";
// import { TaskResultService } from "../taskResult/taskResult.service";

export const contentController = {
    async createContent(req: Request, res: Response) {
        const result = await ContentService.createContent(req.user!, req.body);
        return res.status(201).json(result);
    },

    async updateContent(req: Request, res: Response) {
        const contentId = Number(req.params.contentId);
        const result = await ContentService.updateContent(req.user!, contentId, req.body);
        return res.json(result);
    },

    // async updateTaskResult(req: Request<{ contentId: string, userId: string }>, res: Response) {
    //     const result = await TaskResultService.updateTaskResult(req.user!, parseInt(req.params.contentId), parseInt(req.params.userId), req.body);
    //     return res.json(result);
    // }
};