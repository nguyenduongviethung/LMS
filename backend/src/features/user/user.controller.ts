import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UserIdentity, CreateUserDTO, UpdateUserDTO } from "backend/src/features/user/user.model";

export const userController = {
    async getUsers(req: Request<{}, {}, UserIdentity>, res: Response) {
        const users = await UserService.getUsers(req.user!);
        res.json(users);
    },

    async createUser (req: Request<{}, {}, CreateUserDTO>, res: Response) {
        const created = await UserService.createUser(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    async updateUser (req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response) {
        const updated = await UserService.updateUser(req.user!, parseInt(req.params.id), req.body);
        return res.json({ data: updated });
    },

    async deleteUser (req: Request<{ id: string }>, res: Response) {
        await UserService.deleteUser(req.user!, parseInt(req.params.id));
        return res.status(204).send();
    }
};
