import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UserIdentity, CreateUserDTO, UpdateUserDTO } from "@shared/src/types/user.types";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserClassService } from "../userClass/userClass.service";

export const userController = {
    async getUsers(req: Request, res: Response) {
        const users = await UserService.getUsers(req.user!);
        res.json(users);
    },

    async getMe(req: Request, res: Response) {
        const user = await UserService.getMe(req.user!);
        res.json(user);
    },

    async getDetailUser(req: Request<{ userId: string }>, res: Response) {
        const user = await UserService.getDetailUser(req.user!, Number(req.params.userId));
        res.json(user);
    },

    async getClasses(req: Request<{ userId: string }>, res: Response) {
        const userId = Number(req.params.userId);

        let roles: UserClassRole[] | undefined;

        if (req.query.roles) {
            if (Array.isArray(req.query.roles)) {
                roles = req.query.roles as UserClassRole[];
            } else if (typeof req.query.roles === "string") {
                roles = req.query.roles.split(",") as UserClassRole[];
            }
        }
        
        const userClasses = await UserClassService.getByUserId(
            req.user!,
            true,
            userId,
            roles
        );

        return res.json(userClasses);
    },

    async createUser(req: Request<{}, {}, CreateUserDTO>, res: Response) {
        const created = await UserService.createUser(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    async updateUser(req: Request<{ userId: string }, {}, UpdateUserDTO>, res: Response) {
        const updated = await UserService.updateUser(req.user!, Number(req.params.userId), req.body);
        return res.json({ data: updated });
    },

    async deleteUser(req: Request<{ userId: string }>, res: Response) {
        await UserService.deleteUser(req.user!, Number(req.params.userId));
        return res.status(204).send();
    }
};
