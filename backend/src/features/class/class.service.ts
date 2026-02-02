import { ClassRepository } from "./class.repository";
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from "@shared/src/types/class.types";
import { WithPermission } from "@shared/src/types/permission.types";
import { UserIdentity } from "@shared/src/types/user.types";
import { UserClassRepository } from "../userClass/userClass.repository";
import { ForbiddenError } from "../../common/errors/ForbiddenError";
import { UserRole } from "@shared/src/enums/user.enum";
import { UserClassRole } from "@shared/src/enums/userClass.enum";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { ClassPolicy } from "@/policies/class.policy";
import { UserClassPolicy } from "@/policies/userClass.policy";

const addPermission = async (currentUser: UserIdentity, cls: ClassPublicDTO): Promise<WithPermission<ClassPublicDTO>> => {
    return {
        data: cls,
        permission: {
            canUpdate: await ClassPolicy.update(currentUser, cls.classId),
            canDelete: await ClassPolicy.delete(currentUser),
            canGet: await ClassPolicy.get(currentUser, cls.classId),
            canCreateUserClass: await UserClassPolicy.create(currentUser, cls.classId)
        }
    }
};

export const ClassService = {
    async getAllowedClassIds(currentUser: UserIdentity): Promise<number[]> {
        // ADMIN
        if (currentUser.role === UserRole.ADMIN) {
            return ClassRepository.findAllIds();
        }

        const userClasses = await UserClassRepository.findByUserIdsAndClassIds(true, [currentUser.userId]);

        const teacherClassIds = new Set<number>([currentUser.userId]);
        const taClassIds = new Set<number>();
        const allowedClassIds = new Set<number>();

        for (const uc of userClasses) {
            if (uc.role === UserClassRole.TEACHER) {
                teacherClassIds.add(uc.class.classId);
            }
            if (uc.role === UserClassRole.TEACHER_ASSISTANT) {
                taClassIds.add(uc.class.classId);
            }
            if (uc.role === UserClassRole.STUDENT) {
                allowedClassIds.add(uc.class.classId);
            }
        }

        // teacher → toàn bộ lớp mình dạy
        teacherClassIds.forEach(id => allowedClassIds.add(id));

        // TA → lớp của các teacher trong lớp TA tham gia
        if (taClassIds.size > 0) {
            // tìm teacher trong các lớp TA tham gia
            const teachers = await UserClassRepository.findByUserIdsAndClassIds(
                true, undefined, [...taClassIds], [UserClassRole.TEACHER]
            );
            const teacherIds = teachers.map(t => t.user.userId);

            if (teacherIds.length > 0) {
                // tìm toàn bộ lớp của các teacher này
                const classIds = await UserClassRepository.findByUserIdsAndClassIds(
                    true, teacherIds, undefined
                ).then(ucs => ucs.map(uc => uc.class.classId));
                classIds.forEach(id => allowedClassIds.add(id));
            }
        }

        return [...allowedClassIds];
    },

    async getByContentId(contentId: number): Promise<ClassPublicDTO[]> {
        return ClassRepository.findByContentId(contentId);
    },

    async getClasses(currentUser: UserIdentity): Promise<WithPermission<ClassPublicDTO>[]> {
        const classes = await ClassRepository.findByIds(await this.getAllowedClassIds(currentUser));
        return await Promise.all(classes.map(async cls => await addPermission(currentUser, cls)));
    },

    async getById(currentUser: UserIdentity, classId: number): Promise<WithPermission<ClassPublicDTO>> {
        if (!await ClassPolicy.get(currentUser, classId)) {
            throw new ForbiddenError("CLASS.FORBIDDEN_GET");
        }
        const cls = await ClassRepository.findById(classId);
        if (!cls) {
            throw new NotFoundError("CLASS.NOT_FOUND");
        }
        return await addPermission(currentUser, cls);
    },

    async create(currentUser: UserIdentity, payload: CreateClassDTO): Promise<WithPermission<ClassPublicDTO>> {
        if (!await ClassPolicy.create(currentUser)) {
            throw new ForbiddenError("CLASS.FORBIDDEN_CREATE");
        }

        const cls = await ClassRepository.create({
            ...payload,
        });
        return addPermission(currentUser, cls);
    },

    async update(currentUser: UserIdentity, classId: number, payload: UpdateClassDTO): Promise<WithPermission<ClassPublicDTO>> {
        if (!await ClassPolicy.update(currentUser, classId)) {
            throw new ForbiddenError("CLASS.FORBIDDEN_UPDATE");
        }
        const cls = await ClassRepository.update(classId, payload);
        return addPermission(currentUser, cls);
    },

    async delete(currentUser: UserIdentity, classId: number): Promise<ClassPublicDTO> {
        if (!await ClassPolicy.delete(currentUser)) {
            throw new ForbiddenError("CLASS.FORBIDDEN_DELETE");
        }
        return ClassRepository.delete(classId);
    },
};