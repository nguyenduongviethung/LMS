import { Request, Response } from "express";
import { SessionContentService } from "./sessionContent.service";
import { CreateSessionContentDTO } from "@shared/src/types/sessionContent.types";

export const sessionContentController = {
    async createSessionContent(req: Request<{}, {}, CreateSessionContentDTO>, res: Response) {
        const created = await SessionContentService.create(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    async deleteSessionContent(req: Request<{ sessionId: string, contentId: string }>, res: Response) {
        await SessionContentService.delete(req.user!, parseInt(req.params.sessionId), parseInt(req.params.contentId));
        return res.status(204).send();
    }
};