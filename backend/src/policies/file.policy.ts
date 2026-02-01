import { UserService } from "@/features/user/user.service";
import { UserClassService } from "@/features/userClass/userClass.service";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserIdentity } from "@shared/src/types/user.types";

export const FilePolicy = {
    async create(currentUser: UserIdentity): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const roles = await UserClassService.getUserClassRoles(currentUser.userId);
        return roles.includes(UserClassRole.TEACHER);
    },
}