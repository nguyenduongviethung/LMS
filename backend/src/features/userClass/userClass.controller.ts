import { Request, Response } from 'express';
import { UserClassService } from './userClass.service';
import { UserIdentity } from '@shared/src/user/user.model';
import { CreateUserClassDTO, UpdateUserClassDTO } from '@shared/src/userClass/userClass.model';

export const userClassController = {
    createUserClass: async (req: Request<{}, {}, CreateUserClassDTO>, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const created = await UserClassService.createUserClass(req.user, req.body);
        return res.status(201).json({ data: created });
    },

    updateUserClass: async (req: Request<{ userId: string, classId: string }, {}, UpdateUserClassDTO>, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const updated = await UserClassService.updateUserClass(req.user, parseInt(req.params.userId), parseInt(req.params.classId), req.body);
        return res.json({ data: updated });
    },

    deleteUserClass: async (req: Request<{ userId: string, classId: string }>, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        await UserClassService.updateUserClass(req.user, parseInt(req.params.userId), parseInt(req.params.classId), {isDeleted: true});
        return res.status(204).send();
    }
};