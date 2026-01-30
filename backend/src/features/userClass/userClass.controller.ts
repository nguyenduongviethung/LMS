import { Request, Response } from 'express';
import { UserClassService } from './userClass.service';
// import { AttendanceService } from '../attendance/attendance.service';
import { CreateUserClassDTO, UpdateUserClassDTO } from '@shared/src/types/userClass.types';

export const userClassController = {
    async getUserClass (req: Request<{ userClassId: string}>, res: Response) {
        const userClass = await UserClassService.getById(req.user!, Number(req.params.userClassId));
        res.json(userClass);
    },

    // async getAttendance(req: Request, res: Response) {
    //     const attendance = await AttendanceService.getUserClassAttendance(req.user!, Number(req.params.userClassId));
    //     res.json(attendance);
    // },

    async createUserClass (req: Request<{}, {}, CreateUserClassDTO>, res: Response) {
        const created = await UserClassService.createUserClass(req.user!, req.body);
        return res.status(201).json({ data: created });
    },

    async updateUserClass (req: Request<{ userClassId: string }, {}, UpdateUserClassDTO>, res: Response) {
        const updated = await UserClassService.updateUserClass(req.user!, parseInt(req.params.userClassId), req.body);
        return res.json({ data: updated });
    },

    async deleteUserClass (req: Request<{ userClassId: string }>, res: Response) {
        await UserClassService.deleteUserClass(req.user!, parseInt(req.params.userClassId));
        return res.status(204).send();
    }
};