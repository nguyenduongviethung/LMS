import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/user.model';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LogoutRequest {
    userId: number;
}

interface RefreshTokenRequest {
    refreshToken: string;
}

// interface OtpRequest {
//     email: string;
// }

// interface VerifyOtpRequest {
//     email: string;
//     otp: string;
// }

export const AuthController = {
    async login(req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction) {
        const { accessToken, refreshToken } = await AuthService.login(req.body);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,       // true khi dùng HTTPS
            sameSite: "strict",
            path: "/auth/refresh"
        });

        return res.json({ accessToken });
    },

    async register(req: Request<{}, {}, CreateUserDTO>, res: Response, next: NextFunction) {
        const result = await AuthService.register(req.body);
        return res.json(result);
    },

    async refreshToken(req: Request<{}, {}, RefreshTokenRequest>, res: Response, next: NextFunction) {
        const result = await AuthService.refreshToken(req.cookies.refreshToken);
        return res.json(result);
    },

    async logout(req: Request<{}, {}, LogoutRequest>, res: Response, next: NextFunction) {
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await AuthService.logout({ userId: req.user.userId });
        return res.json({ message: "Logged out" });
    },

    // async requestOtp(req: Request<{}, {}, OtpRequest>, res: Response, next: NextFunction) {
    //     await AuthService.requestOtp(req.body.email);
    //     return res.json({ message: "OTP sent" });
    // },

    // async verifyOtp(req: Request<{}, {}, VerifyOtpRequest>, res: Response, next: NextFunction) {
    //     const ok = await AuthService.verifyOtp(req.body.email, req.body.otp);
    //     return res.json({ verified: ok });
    // }
};
