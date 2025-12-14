import { Request, Response } from "express";
import { userService } from "./user.service";
import { UserIdentity, CreateUserDTO, UpdateUserDTO } from "./user.model";

export const userController = {
    async getUsers(req: Request<{}, {}, UserIdentity>, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const users = await userService.getUsers(req.user);
        res.json(users);
    },

    createUser: async (req: Request<{}, {}, CreateUserDTO>, res: Response) => {
        if (!req.user || req.user.roleName !== "admin") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const created = await userService.createUser(req.body);
        return res.status(201).json({ data: created });
    },

    updateUser: async (req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response) => {
        if (!req.user || (req.user.roleName !== "admin" && req.user.userId !== parseInt(req.params.id))) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const updated = await userService.updateUser(parseInt(req.params.id), req.body);
        return res.json({ data: updated });
    },

    deleteUser: async (req: Request<{ id: string }>, res: Response) => {
        if (!req.user || req.user.roleName !== "admin") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await userService.deleteUser(parseInt(req.params.id));
        return res.status(204).send();
    }
};
