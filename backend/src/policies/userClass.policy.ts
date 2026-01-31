import { UserService } from "@/features/user/user.service";
import { UserClassService } from "@/features/userClass/userClass.service";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserIdentity } from "@shared/src/types/user.types";
import { ClassPolicy } from "./class.policy";

export const UserClassPolicy = {
    async get(currentUser: UserIdentity, userClassId: number): Promise<boolean> {
        const userClass = await UserClassService.getByIdRaw(userClassId);
        if (!await ClassPolicy.get(currentUser, userClass.class.classId)) {
            return false;
        }
        const roles = await UserClassService.getUserClassRoles(currentUser.userId, userClass.class.classId);
        if (roles.includes(UserClassRole.TEACHER) || roles.includes(UserClassRole.TEACHER_ASSISTANT)) {
            return true;
        }
        return userClass.user.userId === currentUser.userId;
    },

    async create(currentUser: UserIdentity, classId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const roles = await UserClassService.getUserClassRoles(currentUser.userId, classId);
        return roles.some(role => role === UserClassRole.TEACHER);
    },

    async manage(currentUser: UserIdentity, userClassId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        return (await UserClassService.getUserClassRole(userClassId)) === UserClassRole.TEACHER;
    },
}