import { UserService } from "../user/user.service";
import { JwtUtil } from "../../common/utils/jwt.util";
import { HashUtil } from "../../common/utils/hash.util";
import { LoginRequest, LogoutRequest } from "./authentication.controller";
import { UserIdentity, CreateUserDTO } from "@shared/src/types/user.types";
import { UserRepository } from "../user/user.repository";

export const AuthenticationService = {
    async register(currentUser: UserIdentity, data: CreateUserDTO) {
        return UserService.createUser(currentUser, data); 
    },

    async login({ email, password } : LoginRequest) {
        const user = await UserRepository.findByEmail(email);

        if (!user) throw new Error("Invalid credentials");

        const correct = await HashUtil.compare(password, user.password);
        if (!correct) throw new Error("Invalid credentials");
        
        const accessToken = JwtUtil.generateAccessToken( user );
        const refreshToken = JwtUtil.generateRefreshToken( user );

        await UserRepository.storeRefreshToken(user.userId, refreshToken);

        return { accessToken, refreshToken };
    },

    async refreshToken(rToken: string) {
        const payload = JwtUtil.verifyRefreshToken(rToken);
        const newAccessToken = JwtUtil.generateAccessToken(payload);
        return { accessToken: newAccessToken };
    },

    async logout({ userId } : LogoutRequest) {
        await UserRepository.deleteRefreshToken(userId);
    },
};
