import { UserProgramPublicDTO } from "./userProgram.model";
import { prisma } from "../../shared/prisma/client";
import { userProgramPublicSelect } from "./userProgram.select";
import { CreateUserProgramDTO, UpdateUserProgramDTO } from "./userProgram.model";

export const userProgramRepository = {
    async findByUserId(userId: number): Promise<UserProgramPublicDTO[]> {
        return prisma.userProgram.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            select: userProgramPublicSelect,
        });
    },

    async findByUserIdAndProgramId(userId: number, programId: number): Promise<UserProgramPublicDTO[]> {
        return prisma.userProgram.findMany({
            where: {
                userId,
                programId,
                deletedAt: null,
            },
            select: userProgramPublicSelect,
        });
    },
    
    async create(data: CreateUserProgramDTO): Promise<UserProgramPublicDTO> {
        return prisma.userProgram.create({
            data,
            select: userProgramPublicSelect,
        });
    },

    async update(userProgramId: number, data: UpdateUserProgramDTO): Promise<UserProgramPublicDTO> {
        return prisma.userProgram.update({
            where: { userProgramId },
            data,
            select: userProgramPublicSelect,
        });
    }
};