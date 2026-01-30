import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository";
import { CreateUserDTO, UserIdentity, UserPublicDTO, UserRecord } from "@shared/src/types/user.types";

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

export const UserService = {
    async createUser(currentUser: UserIdentity, data: CreateUserDTO): Promise<UserPublicDTO> {
        const hashed = await bcrypt.hash(data.password, 10);

        return mapToDetailDTO(await UserRepository.create({
            ...data,
            password: hashed
        }));
    },
};