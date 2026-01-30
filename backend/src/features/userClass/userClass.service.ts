import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserClassRepository } from "./userClass.repository";

export const UserClassService = {
    async getUserClassRoles(userId: number, classId?: number): Promise<UserClassRole[]> {
        const userClasses = await UserClassRepository.findByUserIdsAndClassIds(false, [userId], classId ? [classId] : undefined);
        return userClasses.map(uc => uc.role);
    },
};