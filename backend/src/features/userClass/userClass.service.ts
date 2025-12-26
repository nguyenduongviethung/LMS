import { userClassRepository } from "./userClass.repository";
import { UserIdentity } from "@shared/src/user/user.model";
import { CreateUserClassDTO, UpdateUserClassDTO } from "@shared/src/userClass/userClass.model";
import { ClassService } from "../class/class.service"

export const UserClassService = {
    async createUserClass(currentUser: UserIdentity, data: CreateUserClassDTO) {
        if (!ClassService.canManageClass(currentUser, data.classId)) {
            throw new Error("Unauthorized");
        }
        return userClassRepository.create(data);
    },

    async updateUserClass(currentUser: UserIdentity, userId: number, classId: number, data: UpdateUserClassDTO) {
        if (!ClassService.canManageClass(currentUser, classId)) {
            throw new Error("Unauthorized");
        }
        return userClassRepository.update(userId, classId, data);
    }
};