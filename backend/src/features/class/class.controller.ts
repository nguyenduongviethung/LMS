import { Request, Response, NextFunction } from "express";
import { ClassService } from "./class.service";


export const classController = {
    async getClasses(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const users = await ClassService.getClasses(req.user);
        res.json(users);
    },

    async createClass(req: Request, res: Response, next: NextFunction) {
        const result = await ClassService.create(req.body);
        return res.status(201).json(result);
    },

    async updateClass(req: Request, res: Response, next: NextFunction) {
        const classId = Number(req.params.id);
        const result = await ClassService.update(classId, req.body);
        return res.json(result);
    },

    async deleteClass(req: Request, res: Response, next: NextFunction) {
        const classId = Number(req.params.id);
        await ClassService.delete(classId);
        return res.status(204).send();
    },
};