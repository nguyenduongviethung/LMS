import { Request, Response } from "express";
import { UserProgramService } from "./userProgram.service";
import { CreateUserProgramDTO, UpdateUserProgramDTO } from "./userProgram.model";

export const userProgramController = {
    createUserProgram: async (req: Request<{}, {}, CreateUserProgramDTO>, res: Response) => {
        const created = await UserProgramService.create(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    updateUserProgram: async (req: Request<{ userProgramId: string }, {}, UpdateUserProgramDTO>, res: Response) => {
        const updated = await UserProgramService.update(req.user!, parseInt(req.params.userProgramId), req.body);
        return res.json({ data: updated });
    },

    deleteUserProgram: async (req: Request<{ userProgramId: string }>, res: Response) => {
        await UserProgramService.update(req.user!, parseInt(req.params.userProgramId), { deletedAt: new Date() });
        return res.status(204).send();
    }
};