import { Request, Response } from 'express';
import { UserClassService } from './userClass.service';
import { CreateUserClassDTO, UpdateUserClassDTO } from 'backend/src/features/userClass/userClass.model';
import { UnauthorizedError } from 'backend/src/common/errors/UnauthorizedError';

export const userClassController = {
    createUserClass: async (req: Request<{}, {}, CreateUserClassDTO>, res: Response) => {
        const created = await UserClassService.createUserClass(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    updateUserClass: async (req: Request<{ userClassId: string }, {}, UpdateUserClassDTO>, res: Response) => {
        const updated = await UserClassService.updateUserClass(req.user!, parseInt(req.params.userClassId), req.body);
        return res.json({ data: updated });
    },

    deleteUserClass: async (req: Request<{ userClassId: string }>, res: Response) => {
        if (!req.user) {
            throw new UnauthorizedError();
        }
        await UserClassService.updateUserClass(req.user, parseInt(req.params.userClassId), { deletedAt: new Date() });
        return res.status(204).send();
    }
};