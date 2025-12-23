import { userService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { HashUtil } from "../../shared/utils/hash.util";
// import { OtpUtil } from "../shared/utils/otp.util";
import { CreateUserDTO } from "@shared/src/user/user.model";
import { LoginRequest, LogoutRequest } from "./auth.controller";

export const AuthService = {
    async register(data: CreateUserDTO) {
        return userService.createUser(data); 
    },

    async login({ email, password } : LoginRequest) {
        const user = await UserRepository.findByEmail(email);

        if (!user) throw new Error("Invalid credentials");

        const correct = await HashUtil.compare(password, user.password);
        if (!correct) throw new Error("Invalid credentials");
        

        const accessToken = JwtUtil.generateAccessToken({ userId: user.userId, roleName: user.roleName });
        const refreshToken = JwtUtil.generateRefreshToken({ userId: user.userId, roleName: user.roleName });

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

    // async requestOtp(email: string) {
    //     const otp = OtpUtil.generateOtp(); 
    //     await OtpUtil.sendOtp(email, otp);
    //     await UserRepository.saveOtp(email, otp);
    // },

    // async verifyOtp(email: string, otp: string) {
    //     return await UserRepository.verifyOtp(email, otp);
    // }
};
