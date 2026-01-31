import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { UserClassRepository } from "./userClass.repository";
import { ForbiddenError } from "@/common/errors/ForbiddenError";
import { UserIdentity } from "@shared/src/types/user.types";
import { CreateUserClassDTO, UpdateUserClassDTO, UserClassPublicDTO } from "@shared/src/types/userClass.types";
import { WithPermission } from "@shared/src/types/permission.types";
import { UserPolicy } from "@/policies/user.policy";
import { UserClassPolicy } from "@/policies/userClass.policy";
import { ClassService } from "../class/class.service";
import { NotFoundError } from "@/common/errors/NotFoundError";

const addPermissions = async (currentUser: UserIdentity, userClass: UserClassPublicDTO): Promise<WithPermission<UserClassPublicDTO>> => {
    return {
        data: userClass,
        permission: {
            canUpdate: await UserClassPolicy.manage(currentUser, userClass.userClassId),
            canDelete: await UserClassPolicy.manage(currentUser, userClass.userClassId),
        }
    };
}

export const UserClassService = {
    async getUserClassRole(userClassId: number): Promise<UserClassRole | null> {
        const userClass = await UserClassRepository.findById(userClassId);
        return userClass ? userClass.role : null;
    },

    async getUserClassRoles(userId: number, classId?: number): Promise<UserClassRole[]> {
        const userClasses = await UserClassRepository.findByUserIdsAndClassIds(false, [userId], classId ? [classId] : undefined);
        return userClasses.map(uc => uc.role);
    },

    async getByUserId(currentUser: UserIdentity, active: boolean, userId: number, userClassRoles?: UserClassRole[]): Promise<WithPermission<UserClassPublicDTO>[]> {
        if (!await UserPolicy.getDetail(currentUser, userId)) {
            throw new ForbiddenError("USER.FORBIDDEN_GET_DETAIL");
        }
        const result = await UserClassRepository.findByUserIdsAndClassIds(active, [userId], undefined, userClassRoles);
        return Promise.all(result.map(async userClass => addPermissions(currentUser, userClass)));
    },

    async getByClassId(currentUser: UserIdentity, active: boolean, classId: number, userClassRoles?: UserClassRole[]): Promise<WithPermission<UserClassPublicDTO>[]> {
        if (!await ClassService.getAllowedClassIds(currentUser).then(ids => ids.includes(classId))) {
            throw new ForbiddenError("CLASS.FORBIDDEN_GET");
        }
        const result = await UserClassRepository.findByUserIdsAndClassIds(active, undefined, [classId], userClassRoles);
        return Promise.all(result.map(async userClass => addPermissions(currentUser, userClass)));
    },

    async getByIdRaw(userClassId: number) {
        const result = await UserClassRepository.findById(userClassId);
        if (!result) {
            throw new NotFoundError("USER_CLASS.NOT_FOUND");
        }
        return result;
    },

    async getById(currentUser: UserIdentity, userClassId: number): Promise<WithPermission<UserClassPublicDTO>> {
        if (!await UserClassPolicy.get(currentUser, userClassId)) {
            throw new ForbiddenError("USER_CLASS.FORBIDDEN_GET");
        }
        const result = await UserClassRepository.findById(userClassId);
        if (!result) {
            throw new NotFoundError("USER_CLASS.NOT_FOUND");
        }
        return addPermissions(currentUser, result);
    },

    async createUserClass(currentUser: UserIdentity, data: CreateUserClassDTO) {
        if (!await UserClassPolicy.create(currentUser, data.classId)) {
            throw new ForbiddenError("USER_CLASS.FORBIDDEN_CREATE");
        }
        return UserClassRepository.create(data);
    },

    async updateUserClass(currentUser: UserIdentity, userClassId: number, data: UpdateUserClassDTO) {
        if (!await UserClassPolicy.manage(currentUser, userClassId)) {
            throw new ForbiddenError("USER_CLASS.FORBIDDEN_UPDATE");
        }
        return UserClassRepository.update(userClassId, data);
    },

    async deleteUserClass(currentUser: UserIdentity, userClassId: number): Promise<UserClassPublicDTO> {
        if (!await UserClassPolicy.manage(currentUser, userClassId)) {
            throw new ForbiddenError("USER_CLASS.FORBIDDEN_DELETE");
        }
        return UserClassRepository.delete(userClassId);
    }
};