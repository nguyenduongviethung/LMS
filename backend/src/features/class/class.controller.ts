import { Request, Response } from "express";
import { ClassService } from "./class.service";
// import { SessionService } from "../session/session.service";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserClassService } from "../userClass/userClass.service";
// import { AttendanceService } from "../attendance/attendance.service";
import { BadRequestError } from "../../common/errors/BadRequestError";

export const classController = {
    async getClasses(req: Request, res: Response) {
        const classes = await ClassService.getClasses(req.user!);
        res.json(classes);
    },

    async getDetailClass(req: Request<{ classId: string }>, res: Response) {
        const cls = await ClassService.getById(req.user!, parseInt(req.params.classId));
        res.json(cls);
    },

    async getUsers(req: Request<{ classId: string }>, res: Response) {
        const classId = parseInt(req.params.classId, 10);

        let roles: UserClassRole[] | undefined;

        if (req.query.roles) {
            if (Array.isArray(req.query.roles)) {
                roles = req.query.roles as UserClassRole[];
            } else if (typeof req.query.roles === "string") {
                roles = req.query.roles.split(",") as UserClassRole[];
            }
        }

        const userClasses = await UserClassService.getByClassId(
            req.user!,
            true,
            classId,
            roles
        );

        return res.json(userClasses);
    },

    // async getSessions(req: Request<{ classId: string }>, res: Response) {
    //     const sessions = await SessionService.getByClassIds(req.user!, [Number(req.params.classId)]);
    //     res.json(sessions);
    // },


    async createClass(req: Request, res: Response) {
        const result = await ClassService.create(req.user!, req.body);
        return res.status(201).json(result);
    },

    async updateClass(req: Request, res: Response) {
        const classId = Number(req.params.classId);
        const result = await ClassService.update(req.user!, classId, req.body);
        return res.json(result);
    },

    async deleteClass(req: Request, res: Response) {
        const classId = Number(req.params.classId);
        await ClassService.delete(req.user!, classId);
        return res.status(204).send();
    },
};