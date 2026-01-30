import { UserService } from "@/features/user/user.service";
import { UserClassService } from "@/features/userClass/userClass.service";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserIdentity } from "@shared/src/types/user.types";

export const ClassPolicy = {
    async create(currentUser: UserIdentity): Promise<boolean> {
        return await UserService.getUserRole(currentUser) === UserRole.ADMIN;
    },

    async update(currentUser: UserIdentity, classId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        return UserClassService.getUserClassRoles(currentUser.userId, classId).then(userClasses => {
            return userClasses.some(role => role === UserClassRole.TEACHER);
        });
    },

    async delete(currentUser: UserIdentity): Promise<boolean> {
        return await UserService.getUserRole(currentUser) === UserRole.ADMIN;
    },

    async createSession(currentUser: UserIdentity, classId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        return UserClassService.getUserClassRoles(currentUser.userId, classId).then(roles => roles.includes(UserClassRole.TEACHER));
    }
};