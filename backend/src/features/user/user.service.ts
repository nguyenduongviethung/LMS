import { UserRepository } from "./user.repository";
import { UserIdentity, UserPublicDTO, CreateUserDTO, UpdateUserDTO } from "backend/src/features/user/user.model";
import { AuthorizationService } from "../authorization/authorization.service";
import bcrypt from "bcrypt";
import { UserRole, UserClassRole } from "@prisma/client";
import { ForbiddenError } from "backend/src/common/errors/ForbiddenError";

export const UserService = {
    async isAdmin(currentUser: UserIdentity): Promise<boolean> {
        const role = await this.getUserRole(currentUser);
        return role === UserRole.ADMIN;
    },

    async getUserRole(currentUser: UserIdentity): Promise<UserRole> {
        const user = await UserRepository.findByIds([currentUser.userId]);
        return user[0].role;
    },

    async getUserClassRoles(currentUser: UserIdentity) {
        const user = await UserRepository.findByIds([currentUser.userId]);
        return user[0].userClasses.map(uc => ({ className: uc.class.name, role: uc.role }));
    },


    async getUsers(currentUser: UserIdentity): Promise<UserPublicDTO[]> {
        if (!(await AuthorizationService.canGetAllUsers(currentUser))) {
            return UserRepository.findByIds([currentUser.userId]);
        }
        return UserRepository.findAll();
    },

    async createUser (currentUser: UserIdentity, data: CreateUserDTO) {
        if (!(await AuthorizationService.canCreateUser(currentUser))) {
            throw new ForbiddenError("Forbidden: You do not have permission to create users.");
        }
        const hashed = await bcrypt.hash(data.password, 10);

        return UserRepository.create({
            ...data,
            password: hashed
        });
    },

    async updateUser (currentUser: UserIdentity, userId: number, data: UpdateUserDTO): Promise<UserPublicDTO> {
        if (!(await AuthorizationService.canUpdateUser(currentUser, userId))) {
            throw new ForbiddenError("Forbidden: You do not have permission to update this user.");
        }
        return UserRepository.update(userId, data);
    },

    async deleteUser (currentUser: UserIdentity, id: number): Promise<UserPublicDTO> {
        if (!(await AuthorizationService.canDeleteUser(currentUser, id))) {
            throw new ForbiddenError("Forbidden: You do not have permission to delete this user.");
        }
        return UserRepository.update(id, { deletedAt: new Date() } );
    }
};
