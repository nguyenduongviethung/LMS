import { UserRepository } from "../user/user.repository";
import { JwtUtil } from "../shared/utils/jwt.util";
import { HashUtil } from "../shared/utils/hash.util";
// import { OtpUtil } from "../shared/utils/otp.util";

interface RegisterData {
    email: string;
    password: string;
    [key: string]: any; // Add other fields as needed
}

export const AuthService = {
    async register(data: RegisterData) {
        const hashed = await HashUtil.hashPassword(data.password);
        // Ensure required fields are provided: name, state, role
        return UserRepository.create({ 
            ...data, 
            password: hashed,
            name: data.name || "", // Provide a default or require in RegisterData
            state: data.state || "active", // Adjust default as needed
            role: data.role || "user" // Adjust default as needed
        });
    },

    async login(email: string, password: string) {
        const user = await UserRepository.findByEmail(email);

        if (!user) throw new Error("Invalid credentials");

        const correct = await HashUtil.compare(password, user.password);
        if (!correct) throw new Error("Invalid credentials");

        const accessToken = JwtUtil.generateAccessToken({ id: user.userId });
        const refreshToken = JwtUtil.generateRefreshToken({ id: user.userId });

        await UserRepository.storeRefreshToken(user.userId, refreshToken);

        return { accessToken, refreshToken };
    },

    async refreshToken(rToken: string) {
        const payload = JwtUtil.verifyRefreshToken(rToken);
        if (!payload.sub) {
            throw new Error("Invalid refresh token payload");
        }
        const userId = Number(payload.sub);
        if (isNaN(userId)) {
            throw new Error("Invalid user id in token payload");
        }
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const newAccessToken = JwtUtil.generateAccessToken({ id: user.userId });
        return { accessToken: newAccessToken };
    },

    async logout(userId: number) {
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
