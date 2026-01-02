import { Request, Response } from "express";
import { ProgramService } from "./program.service";

export const programController = {
    async getPrograms(req: Request, res: Response) {
        const programs = await ProgramService.getPrograms(req.user!);
        return res.json(programs);
    },

    async createProgram(req: Request, res: Response) {
        const program = await ProgramService.createProgram(req.user!, req.body);
        return res.status(201).json(program);
    },

    async updateProgram(req: Request, res: Response) {
        const programId = Number(req.params.id);
        const program = await ProgramService.updateProgram(req.user!, programId, req.body);
        return res.json(program);
    },

    async deleteProgram(req: Request, res: Response) {
        const programId = Number(req.params.id);
        await ProgramService.deleteProgram(req.user!, programId);
        return res.status(204).send();
    }
};