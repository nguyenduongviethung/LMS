import { UserRepository } from "./user.repository";
import { userClassRepository } from "../userClass/userClass.repository";
import { UserIdentity, CreateUserDTO, UpdateUserDTO } from "@shared/src/user/user.model";
import bcrypt from "bcrypt";

export const UserService = {
    async getUsers(currentUser: UserIdentity) {
        // ADMIN
        if (currentUser.roleName === "admin") {
            return UserRepository.findAll();
        }

        const userClasses = await userClassRepository.findByUserId(currentUser.userId);

        const teacherClassIds = new Set<number>([currentUser.userId]);
        const taClassIds = new Set<number>();

        for (const uc of userClasses) {
            if (uc.role.roleName === "teacher") {
                teacherClassIds.add(uc.classId);
            }
            if (uc.role.roleName === "teacher_assistant") {
                taClassIds.add(uc.classId);
            }
        }

        const allowedUserIds = new Set<number>();

        // teacher → toàn bộ user trong lớp mình dạy
        if (teacherClassIds.size > 0) {
            const users = await userClassRepository.findUsersByClassIds(
                [...teacherClassIds]
            );
            users.forEach(u => allowedUserIds.add(u.userId));
        }

        // teacher_assistant
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

                const users = await userClassRepository.findUsersByClassIds(classIds);
                users.forEach(u => allowedUserIds.add(u.userId));
            }
        }

        return UserRepository.findByIds([...allowedUserIds]);
    },

    createUser: async (data: CreateUserDTO) => {
        const hashed = await bcrypt.hash(data.password, 10);

        return UserRepository.create({
            ...data,
            roleId: 1, // default role
            stateId: 1, // default state
            password: hashed
        });
    },

    updateUser: async (id: number, data: UpdateUserDTO) => {
        return UserRepository.update(id, data);
    },

    deleteUser: async (id: number) => {
        return UserRepository.update(id, { isDeleted: true });
    }
};
