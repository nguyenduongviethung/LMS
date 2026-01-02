import { UserRepository } from "./user.repository";
import { UserIdentity, UserPublicDTO, CreateUserDTO, UpdateUserDTO } from "backend/src/features/user/user.model";
import { AuthorizationService } from "../authorization/authorization.service";
import bcrypt from "bcrypt";

export const UserService = {
    async getUsers(currentUser: UserIdentity): Promise<UserPublicDTO[]> {
        if (! await AuthorizationService.canGetAllUsers(currentUser.userId)) {
            return UserRepository.findByIds([currentUser.userId]);
        }
        return UserRepository.findAll();
    },

    async createUser (currentUser: UserIdentity, data: CreateUserDTO) {
        if (! await AuthorizationService.canCreateUser(currentUser.userId)) {
            throw new Error("Unauthorized");
        }
        const hashed = await bcrypt.hash(data.password, 10);

        return UserRepository.create({
            ...data,
            roleId: 1, // default role
            stateId: 1, // default state
            password: hashed
        });
    },

    async updateUser (currentUser: UserIdentity, userId: number, data: UpdateUserDTO): Promise<UserPublicDTO> {
        if (! await AuthorizationService.canUpdateUser(currentUser.userId, userId)) {
            throw new Error("Unauthorized");
        }
        return UserRepository.update(userId, data);
    },

    async deleteUser (currentUser: UserIdentity, id: number): Promise<UserPublicDTO> {
        if (! await AuthorizationService.canDeleteUser(currentUser.userId, id)) {
            throw new Error("Unauthorized");
        }
        return UserRepository.update(id, { isDeleted: true });
    }
};
