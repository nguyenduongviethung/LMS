import { ClassService } from "@/features/class/class.service";
import { SessionService } from "@/features/session/session.service";
import { UserService } from "@/features/user/user.service";
import { UserClassService } from "@/features/userClass/userClass.service";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserIdentity } from "@shared/src/types/user.types";

export const SessionPolicy = {
    async get(currentUser: UserIdentity, sessionId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const session = await SessionService.getByIdRaw(sessionId);
        const allowedClassIds = await ClassService.getAllowedClassIds(currentUser);
        return allowedClassIds.includes(session.class.classId);
    },

    async manage(currentUser: UserIdentity, sessionId: number): Promise<boolean> {
        if (await UserService.getUserRole(currentUser) === UserRole.ADMIN) {
            return true;
        }
        const session = await SessionService.getByIdRaw(sessionId);
        return UserClassService.getUserClassRoles(currentUser.userId, session.class.classId).then(roles => roles.includes("TEACHER"));
    },
}