import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository";
import { CreateUserDTO, UpdateUserDTO, UserIdentity, UserPublicDTO, UserRecord } from "@shared/src/types/user.types";
import { UserRole } from "@shared/src/enums/user.enum";
import { WithPermission } from "@shared/src/types/permission.types";
import { NotFoundError } from "@/common/errors/NotFoundError";
import { UserPolicy } from "@/policies/user.policy";
import { ForbiddenError } from "@/common/errors/ForbiddenError";

const mapToPublicDTO = (user: UserPublicDTO): UserPublicDTO => {
    return {
        userId: user.userId,
        name: user.name,
        birthDate: user.birthDate,
        studyPlace: user.studyPlace,
        workPlace: user.workPlace,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
    };
};

const mapToDetailDTO = (user: UserRecord): UserPublicDTO => {
    return {
        ...mapToPublicDTO(user),
        email: user.email,
        phone: user.phone,
    };
};

const addPermissions = async <T extends UserPublicDTO>(currentUser: UserIdentity, user: T): Promise<WithPermission<T>> => {
    return {
        data: user,
        permission: {
            canUpdate: await UserPolicy.update(currentUser, user.userId),
            canDelete: await UserPolicy.delete(currentUser, user.userId),
        }
    };
};

export const UserService = {
    async getUserRole(currentUser: UserIdentity): Promise<UserRole> {
        const user = await UserRepository.findById(currentUser.userId);
        if (!user) {
            throw new NotFoundError("USER.NOT_FOUND");
        }
        return user.role;
    },

    async getUsers(currentUser: UserIdentity): Promise<WithPermission<UserPublicDTO>[]> {
        let users: UserRecord[];
        if (!(await UserPolicy.getAll(currentUser))) {
            const user = await UserRepository.findById(currentUser.userId);
            if (!user) throw new NotFoundError("USER.NOT_FOUND");
            users = [user];
        }
        else users = await UserRepository.findAll();
        return await Promise.all(users.map(async user => {
            const strippedUser = (!await UserPolicy.getDetail(currentUser, user.userId)) ?
                mapToPublicDTO(user) :
                mapToDetailDTO(user);
            return addPermissions(currentUser, strippedUser);
        }));
    },

    async getMe(currentUser: UserIdentity): Promise<WithPermission<UserPublicDTO>> {
        const user = await UserRepository.findById(currentUser.userId);
        if (!user) {
            throw new NotFoundError("USER.NOT_FOUND");
        }
        return addPermissions(currentUser, mapToDetailDTO(user));
    },

    async getDetailUser(currentUser: UserIdentity, userId: number): Promise<WithPermission<UserPublicDTO>> {
        if (!(await UserPolicy.getDetail(currentUser, userId))) {
            throw new ForbiddenError("USER.FORBIDDEN_GET_DETAIL");
        }
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("USER.NOT_FOUND");
        }
        return addPermissions(currentUser, mapToDetailDTO(user));
    },

    async createUser(currentUser: UserIdentity, data: CreateUserDTO): Promise<UserPublicDTO> {
        if (!(await UserPolicy.create(currentUser))) {
            throw new ForbiddenError("USER.FORBIDDEN_CREATE");
        }
        const hashed = await bcrypt.hash(data.password, 10);

        return mapToDetailDTO(await UserRepository.create({
            ...data,
            password: hashed
        }));
    },

    async updateUser(currentUser: UserIdentity, userId: number, data: UpdateUserDTO): Promise<UserPublicDTO> {
        if (!(await UserPolicy.update(currentUser, userId))) {
            throw new ForbiddenError("USER.FORBIDDEN_UPDATE");
        }
        return mapToDetailDTO(await UserRepository.update(userId, data));
    },

    async deleteUser(currentUser: UserIdentity, userId: number): Promise<UserPublicDTO> {
        if (!(await UserPolicy.delete(currentUser, userId))) {
            throw new ForbiddenError("USER.FORBIDDEN_DELETE");
        }
        return mapToDetailDTO(await UserRepository.delete(userId));
    }
};