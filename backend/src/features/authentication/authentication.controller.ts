import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from 'backend/src/features/user/user.model';

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

export const AuthenticationController = {
    async login(req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction) {
        const { accessToken, refreshToken } = await AuthenticationService.login(req.body);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,       // true khi dùng HTTPS
            sameSite: "strict",
            path: "/auth/refresh"
        });

        return res.json({ accessToken });
    },

    async register(req: Request<{}, {}, CreateUserDTO>, res: Response, next: NextFunction) {
        const result = await AuthenticationService.register(req.user!, req.body);
        return res.json(result);
    },

    async refreshToken(req: Request<{}, {}, RefreshTokenRequest>, res: Response, next: NextFunction) {
        const result = await AuthenticationService.refreshToken(req.cookies.refreshToken);
        return res.json(result);
    },

    async logout(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
        await AuthenticationService.logout({ userId: req.user!.userId });
        return res.json({ message: "Logged out" });
    },

    // async requestOtp(req: Request<{}, {}, OtpRequest>, res: Response, next: NextFunction) {
    //     await AuthenticationService.requestOtp(req.body.email);
    //     return res.json({ message: "OTP sent" });
    // },

    // async verifyOtp(req: Request<{}, {}, VerifyOtpRequest>, res: Response, next: NextFunction) {
    //     const ok = await AuthenticationService.verifyOtp(req.body.email, req.body.otp);
    //     return res.json({ verified: ok });
    // }
};
