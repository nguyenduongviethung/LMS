import { Request, Response } from "express";
import { SessionService } from "./session.service";
import { UserIdentity } from "@shared/src/user/user.model";
import { ContentService } from "../content/content.service";
import { CreateSessionDTO, UpdateSessionDTO } from "@shared/src/session/session.model";

export const sessionController = {
    async getSessions(req: Request<{}, {}, UserIdentity>, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const sessions = await SessionService.getSessions(req.user);
        res.json(sessions);
    },

    async getContentsBySessionId(req: Request<{ sessionId: string }>, res: Response) {
        const sessionId = parseInt(req.params.sessionId);
        const contents = await ContentService.getBySessionId(sessionId);
        res.json(contents);
    },

    async createSession(req: Request<{}, {}, CreateSessionDTO>, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const created = await SessionService.createSession(req.body, req.user);
        return res.status(201).json({ data: created });
    },

    async updateSession(req: Request<{ sessionId: string }, {}, UpdateSessionDTO>, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const updated = await SessionService.updateSession(parseInt(req.params.sessionId), req.body);
        return res.json({ data: updated });
    },

    async deleteSession(req: Request<{ sessionId: string }>, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await SessionService.deleteSession(parseInt(req.params.sessionId));
        return res.status(204).send();
    }
};