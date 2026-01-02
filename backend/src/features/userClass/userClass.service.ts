import { userClassRepository } from "./userClass.repository";
import { UserIdentity } from "backend/src/features/user/user.model";
import { CreateUserClassDTO, UpdateUserClassDTO } from "backend/src/features/userClass/userClass.model";
import { AuthorizationService } from "../authorization/authorization.service";

export const UserClassService = {
    async createUserClass(currentUser: UserIdentity, data: CreateUserClassDTO) {
        if (!await AuthorizationService.canManageUserClass(currentUser.userId, data.classId)) {
            throw new Error("Unauthorized");
        }
        return userClassRepository.create(data);
    },

    async updateUserClass(currentUser: UserIdentity, userClassId: number , data: UpdateUserClassDTO) {
        if (!await AuthorizationService.canManageUserClass(currentUser.userId, userClassId)) {
            throw new Error("Unauthorized");
        }
        return userClassRepository.update(userClassId, data);
    }
};