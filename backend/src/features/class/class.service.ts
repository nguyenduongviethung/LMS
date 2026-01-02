import { ClassRepository } from "./class.repository";
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from "backend/src/features/class/class.model";
import { UserIdentity } from "backend/src/features/user/user.model";
import { userClassRepository } from "../userClass/userClass.repository";
import { ForbiddenError } from "backend/src/common/errors/ForbiddenError";
import { UserClassRole, UserRole } from "@prisma/client";
import { AuthorizationService } from "../authorization/authorization.service";

export const ClassService = {
    async getAllowedClassIds(currentUser: UserIdentity): Promise<number[]> {
        // ADMIN
        if (currentUser.role === UserRole.ADMIN) {
            return ClassRepository.findAllIds();
        }

        const userClasses = await userClassRepository.findByUserId(currentUser.userId);

        const teacherClassIds = new Set<number>([currentUser.userId]);
        const taClassIds = new Set<number>();
        const allowedClassIds = new Set<number>();

        for (const uc of userClasses) {
            if (uc.role === UserClassRole.TEACHER) {
                teacherClassIds.add(uc.classId);
            }
            if (uc.role === UserClassRole.TEACHER_ASSISTANT) {
                taClassIds.add(uc.classId);
            }
            if (uc.role === UserClassRole.STUDENT) {
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
                const classIds = await userClassRepository.findClassesByTeacherIds(teacherIds);
                classIds.forEach(id => allowedClassIds.add(id));
            }
        }

        return [...allowedClassIds];
    },

    async getClasses(currentUser: UserIdentity): Promise<ClassPublicDTO[]> {
        return ClassRepository.findByIds(await this.getAllowedClassIds(currentUser));
    },

    async create(currentUser: UserIdentity, payload: CreateClassDTO): Promise<ClassPublicDTO> {
        if (!await AuthorizationService.canCreateClass(currentUser.userId)) {
            throw new ForbiddenError("You do not have permission to create a class");
        }

        return ClassRepository.create({
            ...payload,
            isDeleted: false,
        } as any);
    },

    async update(currentUser: UserIdentity, classId: number, payload: UpdateClassDTO): Promise<ClassPublicDTO> {
        if (!await AuthorizationService.canUpdateClass(currentUser.userId, classId)) {
            throw new ForbiddenError("You do not have permission to update this class");
        }
        return ClassRepository.update(classId, payload);
    },

    async delete(currentUser: UserIdentity, classId: number): Promise<ClassPublicDTO> {
        if (!await AuthorizationService.canDeleteClass(currentUser.userId)) {
            throw new ForbiddenError("You do not have permission to delete this class");
        }
        return ClassRepository.update(classId, { deletedAt: new Date() });
    },
};