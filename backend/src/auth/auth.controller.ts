import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

declare global {
    namespace Express {
        interface Request {
            user?: { id: number };
        }
    }
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    [key: string]: any;
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
        const result = await AuthService.login(req.body.email, req.body.password);
        return res.json(result);
    },

    async register(req: Request<{}, {}, RegisterRequest>, res: Response, next: NextFunction) {
        const result = await AuthService.register(req.body);
        return res.json(result);
    },

    async refreshToken(req: Request<{}, {}, RefreshTokenRequest>, res: Response, next: NextFunction) {
        const result = await AuthService.refreshToken(req.body.refreshToken);
        return res.json(result);
    },

    async logout(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await AuthService.logout(req.user.id);
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
