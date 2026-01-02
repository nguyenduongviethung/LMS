import { Request, Response } from "express";
import { SessionService } from "./session.service";
import { UserIdentity } from "backend/src/features/user/user.model";
import { ContentService } from "../content/content.service";
import { CreateSessionDTO, UpdateSessionDTO } from "backend/src/features/session/session.model";


export const sessionController = {
    async getSessions(req: Request<{}, {}, UserIdentity>, res: Response) {
        const sessions = await SessionService.getSessions(req.user!);
        res.json(sessions);
    },

    async getContentsBySessionId(req: Request<{ sessionId: string }>, res: Response) {
        const sessionId = parseInt(req.params.sessionId);
        const contents = await ContentService.getBySessionId(req.user!, sessionId);
        res.json(contents);
    },

    async createSession(req: Request<{}, {}, CreateSessionDTO>, res: Response) {
        const created = await SessionService.createSession(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    async updateSession(req: Request<{ sessionId: string }, {}, UpdateSessionDTO>, res: Response) {
        const updated = await SessionService.updateSession(req.user!, parseInt(req.params.sessionId), req.body);
        return res.json({ data: updated });
    },

    async deleteSession(req: Request<{ sessionId: string }>, res: Response) {
        await SessionService.deleteSession(req.user!, parseInt(req.params.sessionId));
        return res.status(204).send();
    }
};