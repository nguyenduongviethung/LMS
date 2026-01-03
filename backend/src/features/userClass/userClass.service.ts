import { userClassRepository } from "./userClass.repository";
import { UserIdentity } from "../user/user.model";
import { CreateUserClassDTO, UpdateUserClassDTO } from "./userClass.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { ForbiddenError } from "../../common/errors/ForbiddenError";

export const UserClassService = {
    async getById(userClassId: number) {
        return userClassRepository.findById(userClassId);
    },

    async getByUserId(currentUser: UserIdentity) {
        return userClassRepository.findByUserId(currentUser.userId);
    },

    async getByUserIdAndClassId(currentUser: UserIdentity, classId: number) {
        return userClassRepository.findByUserIdAndClassId(currentUser.userId, classId);
    },

    async createUserClass(currentUser: UserIdentity, data: CreateUserClassDTO) {
        if (!await AuthorizationService.canManageUserClass(currentUser, data.classId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to add users to this class.");
        }
        return userClassRepository.create(data);
    },

    async updateUserClass(currentUser: UserIdentity, userClassId: number , data: UpdateUserClassDTO) {
        if (!await AuthorizationService.canManageUserClass(currentUser, userClassId)) {
            throw new ForbiddenError("Forbidden: You do not have permission to update this user-class association.");
        }
        return userClassRepository.update(userClassId, data);
    }
};