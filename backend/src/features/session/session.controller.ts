import { Request, Response } from "express";
import { sessionService } from "./session.service";
import { UserIdentity } from "@shared/src/user/user.model";
// import { CreateSessionDTO, UpdateSessionDTO } from "@shared/src/session/session.model";

export const sessionController = {
    async getSessions(req: Request<{}, {}, UserIdentity>, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const sessions = await sessionService.getSessions(req.user);
        res.json(sessions);
    },

    // createSession: async (req: Request<{}, {}, CreateSessionDTO>, res: Response) => {
    //     if (!req.user) {
    //         return res.status(401).json({ error: "Unauthorized" });
    //     }
    //     const created = await sessionService.createSession(req.body, req.user);
    //     return res.status(201).json({ data: created });
    // },
    // updateSession: async (req: Request<{ sessionId: string }, {}, UpdateSessionDTO>, res: Response) => {
    //     if (!req.user) {
    //         return res.status(401).json({ error: "Unauthorized" });
    //     }
    //     const updated = await sessionService.updateSession(parseInt(req.params.sessionId), req.body, req.user);
    //     return res.json({ data: updated });
    // },

    // deleteSession: async (req: Request<{ sessionId: string }>, res: Response) => {
    //     if (!req.user) {
    //         return res.status(401).json({ error: "Unauthorized" });
    //     }
    //     await sessionService.deleteSession(parseInt(req.params.sessionId), req.user);
    //     return res.status(204).send();
    // }
};