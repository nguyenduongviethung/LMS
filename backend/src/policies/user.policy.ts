import { UserService } from "@/features/user/user.service";
import { UserClassService } from "@/features/userClass/userClass.service";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserIdentity } from "@shared/src/types/user.types";

export const UserPolicy = {
   async getAll(currentUser: UserIdentity): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        return UserClassService.getUserClassRoles(currentUser.userId).then(roles => {
            return roles.some(role => role === UserClassRole.TEACHER || role === UserClassRole.TEACHER_ASSISTANT);
        });
    },

    async getDetail(currentUser: UserIdentity, userId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        return currentUser.userId === userId;
    },

    async create(currentUser: UserIdentity): Promise<boolean> {
        return await UserService.getUserRole(currentUser) === UserRole.ADMIN;
    },

    async update(currentUser: UserIdentity, targetUserId: number) {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        return currentUser.userId === targetUserId;
    },

    async delete(currentUser: UserIdentity, targetUserId: number): Promise<boolean> {
        if (currentUser.userId === targetUserId) {
            return false;
        }
        return await UserService.getUserRole(currentUser) === UserRole.ADMIN;
    },
};