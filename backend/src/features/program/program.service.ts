import { ProgramRepository } from "./program.repository";
import { UserIdentity } from "../user/user.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { CreateProgramDTO, UpdateProgramDTO, ProgramPublicDTO } from "./program.model";
import { UserProgramService } from "../userProgram/userProgram.service";
import { ForbiddenError } from "backend/src/common/errors/ForbiddenError";

export const ProgramService = {
    async getByContentId(contentId: number): Promise<ProgramPublicDTO[]> {
        return ProgramRepository.findByContentId(contentId);
    },

    async getByTemplateSessionId(templateSessionId: number): Promise<ProgramPublicDTO[]> {
        return ProgramRepository.findByTemplateSessionId(templateSessionId);
    },

    async getPrograms(currentUser: UserIdentity): Promise<ProgramPublicDTO[]> {
        if (currentUser.role === "ADMIN") {
            return ProgramRepository.findAll();
        }
        const userPrograms = await UserProgramService.getByUserId(currentUser.userId);
        const programIds = userPrograms.map(up => up.programId);
        return ProgramRepository.findByIds(programIds);
    },

    async createProgram(currentUser: UserIdentity, data: CreateProgramDTO): Promise<ProgramPublicDTO> {
        if (!await AuthorizationService.canCreateProgram(currentUser)) {
            throw new ForbiddenError("Forbidden: You do not have permission to create programs.");
        }
        return ProgramRepository.create(data);
    },

    async updateProgram(currentUser: UserIdentity, programId: number, data: UpdateProgramDTO): Promise<ProgramPublicDTO> {
        if (!await AuthorizationService.canUpdateProgram(currentUser, programId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to update this program.");
        }
        return ProgramRepository.update(programId, data);
    },

    async deleteProgram(currentUser: UserIdentity, programId: number): Promise<void> {
        if (!await AuthorizationService.canDeleteProgram(currentUser)) {
            throw new ForbiddenError("Forbidden: You do not have permission to delete this program.");
        }
        await ProgramRepository.delete(programId);
    }
};