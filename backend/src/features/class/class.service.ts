import { ClassRepository } from "./class.repository";
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from "@shared/src/class/class.model";
import { UserIdentity } from "@shared/src/user/user.model";
import { userClassRepository } from "../userClass/userClass.repository";

export const ClassService = {
    async create(payload: CreateClassDTO) {
        return ClassRepository.create({
            ...payload,
            isDeleted: false,
        } as any);
    },

    async getAllowedClassIds(currentUser: UserIdentity): Promise<number[]> {
        // ADMIN
        if (currentUser.roleName === "admin") {
            return ClassRepository.findAllIds();
        }

        const userClasses = await userClassRepository.findByUserId(currentUser.userId);

        const teacherClassIds = new Set<number>([currentUser.userId]);
        const taClassIds = new Set<number>();
        const allowedClassIds = new Set<number>();

        for (const uc of userClasses) {
            if (uc.role.roleName === "teacher") {
                teacherClassIds.add(uc.classId);
            }
            if (uc.role.roleName === "teacher_assistant") {
                taClassIds.add(uc.classId);
            }
            if (uc.role.roleName === "student") {
                allowedClassIds.add(uc.classId);
            }
        }

        // teacher → toàn bộ lớp mình dạy
        teacherClassIds.forEach(id => allowedClassIds.add(id));

        // TA → lớp của các teacher trong lớp TA tham gia
        if (taClassIds.size > 0) {
            // tìm teacher trong các lớp TA tham gia
            const teachers = await userClassRepository.findTeachersByClassIds(
                [...taClassIds]
            );
            const teacherIds = teachers.map(t => t.userId);

            if (teacherIds.length > 0) {
                // tìm toàn bộ lớp của các teacher này
                const teacherClasses = await userClassRepository.findClassesByTeacherIds(teacherIds);
                const classIds = teacherClasses.map(c => c.classId);
                classIds.forEach(id => allowedClassIds.add(id));
            }
        }

        return [...allowedClassIds];
    },

    async canManageClass(currentUser: UserIdentity, classId: number): Promise<boolean> {

        // ADMIN → full quyền
        if (currentUser.roleName === "admin") {
            return true;
        }

        // TEACHER → chỉ được quản lý class mình dạy
        if (currentUser.roleName === "teacher") {
            const uc = await userClassRepository.findByUserIdAndClassId(currentUser.userId, classId);

            return !!uc && uc.role.roleName == "teacher";
        }

        return false;
    },

    async getClasses(currentUser: UserIdentity): Promise<ClassPublicDTO[]> {
        return ClassRepository.findByIds(await this.getAllowedClassIds(currentUser));
    },


    async update(classId: number, payload: UpdateClassDTO) {
        return ClassRepository.update(classId, payload);
    },


    async delete(classId: number) {
        return ClassRepository.update(classId, { isDeleted: true });
    },
};