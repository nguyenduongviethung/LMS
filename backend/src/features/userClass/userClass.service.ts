import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserIdentity } from "@shared/src/types/user.types";
import { UserClassRepository } from "./userClass.repository";

export const UserClassService = {
    async getUserClassRoles(userId: number): Promise<UserClassRole[]> {
        const userClasses = await UserClassRepository.findByUserIds(false, [userId]);
        return userClasses.map(uc => uc.role);
    }
};