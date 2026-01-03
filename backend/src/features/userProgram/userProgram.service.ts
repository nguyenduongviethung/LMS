import { userProgramRepository } from "./userProgram.repository";
import { UserIdentity } from "../user/user.model";
import { CreateUserProgramDTO, UpdateUserProgramDTO } from "./userProgram.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { ForbiddenError } from "../../common/errors/ForbiddenError";

export const UserProgramService = {
    async getByUserId(userId: number) {
        return userProgramRepository.findByUserId(userId);
    },

    async getByUserIdAndProgramId(userId: number, programIds: number) {
        return userProgramRepository.findByUserIdAndProgramId(userId, programIds);        
    },

    async getByTemplateSessionId(templateSessionId: number) {
        return userProgramRepository.findByUserId(templateSessionId);        
    },

    async create(currentUser: UserIdentity, data: CreateUserProgramDTO) {
        if (!await AuthorizationService.canManageUserProgram(currentUser, data.programId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to add users to this program.");
        }
        return userProgramRepository.create(data);
    },

    async update(currentUser: UserIdentity, userProgramId: number, data: UpdateUserProgramDTO) {
        if (!await AuthorizationService.canManageSession(currentUser, userProgramId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to update this user-program association.");
        }
        return userProgramRepository.update(userProgramId, data);
    },

    async deleteUserProgram(currentUser: UserIdentity, userProgramId: number) {
        if (!await AuthorizationService.canManageSession(currentUser, userProgramId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to delete this user-program association.");
        }
        await userProgramRepository.update(userProgramId, { deletedAt: new Date() });
    }
};