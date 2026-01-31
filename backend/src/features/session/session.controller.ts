import { Request, Response } from "express";
import { SessionService } from "./session.service";
// import { ContentService } from "../content/content.service";
// import { AttendanceService } from "../attendance/attendance.service";
// import { TaskResultService } from "../taskResult/taskResult.service";
import { CreateSessionDTO, UpdateSessionDTO } from "@shared/src/types/session.types";
import { UserIdentity } from "@shared/src/types/user.types";
import { ContentService } from "../content/content.service";
import { AttendanceService } from "../attendance/attendance.service";


export const sessionController = {
    async getSessions(req: Request<{ sessionId: string }, {}, UserIdentity>, res: Response) {
        const session = await SessionService.getById(req.user!, Number(req.params.sessionId));
        res.json(session);
    },

    async createSession(req: Request<{}, {}, CreateSessionDTO>, res: Response) {
        const created = await SessionService.createSession(req.user!, req.body);
        return res.status(201).json(created);
    },

    async updateSession(req: Request<{ sessionId: string }, {}, UpdateSessionDTO>, res: Response) {
        const updated = await SessionService.updateSession(req.user!, parseInt(req.params.sessionId), req.body);
        return res.json(updated);
    },

    async deleteSession(req: Request<{ sessionId: string }>, res: Response) {
        await SessionService.deleteSession(req.user!, parseInt(req.params.sessionId));
        return res.status(204).send();
    },

    async getContents(req: Request<{ sessionId: string }>, res: Response) {
        const sessionId = parseInt(req.params.sessionId);
        const contents = await ContentService.getBySessionId(req.user!, sessionId);
        res.json(contents);
    },

    async ensureAttendance(req: Request<{ sessionId: string }>, res: Response) {
        const attendance = await AttendanceService.ensureAttendance(req.user!, parseInt(req.params.sessionId));
        res.json(attendance);
    },

    async getAttendance(req: Request, res: Response) {
        const attendances = await AttendanceService.getSessionAttendance(req.user!, Number(req.params.sessionId));
        res.json(attendances);
    },

    async updateAttendance(req: Request<{ sessionId: string, userId: string }>, res: Response) {
        const result = await AttendanceService.updateAttendance(req.user!, parseInt(req.params.sessionId), parseInt(req.params.userId), req.body);
        return res.json(result);
    },

    // async ensureTaskResult(req: Request<{ sessionId: string, contentId: string }>, res: Response) {
    //     const taskResults = await TaskResultService.ensureTaskResult(req.user!, Number(req.params.sessionId), Number(req.params.contentId));
    //     res.json(taskResults);
    // },

    // async getTaskResult(req: Request, res: Response) {
    //     const taskResults = await TaskResultService.getSessionContentTaskResult(req.user!, Number(req.params.sessionId), Number(req.params.contentId));
    //     res.json(taskResults);
    // }
};