import { ClassService } from "@/features/class/class.service";
import { UserService } from "@/features/user/user.service";
import { UserClassService } from "@/features/userClass/userClass.service";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserIdentity } from "@shared/src/types/user.types";

export const ContentPolicy = {
    async create(currentUser: UserIdentity): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const roles = await UserClassService.getUserClassRoles(currentUser.userId);
        return roles.includes(UserClassRole.TEACHER);
    },

    async manage(currentUser: UserIdentity, contentId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const classes = await ClassService.getByContentId(contentId);
        const classRoles = await Promise.all(classes.map(c => 
            UserClassService.getUserClassRoles(currentUser.userId, c.classId)
        ));
        return classRoles.some(roles => roles.includes(UserClassRole.TEACHER));
    },

    async manageTaskResults(currentUser: UserIdentity, contentId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const classes = await ClassService.getByContentId(contentId);
        const classRoles = await Promise.all(classes.map(c => 
            UserClassService.getUserClassRoles(currentUser.userId, c.classId)
        ));
        return classRoles.some(roles => roles.includes(UserClassRole.TEACHER) || roles.includes(UserClassRole.TEACHER_ASSISTANT));
    }
}