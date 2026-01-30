import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from '@shared/src/types/user.types';
import { JwtUtil } from '../../common/utils/jwt.util';

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

export const AuthenticationController = {
    async login(req: Request<{}, {}, LoginRequest>, res: Response) {
        const { accessToken, refreshToken } = await AuthenticationService.login(req.body);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/"
        });

        const user = JwtUtil.verifyAccessToken(accessToken);

        return res.json({ accessToken, user });
    },

    async me(req: Request, res: Response) {
        return res.json(req.user);
    },

    async register(req: Request<{}, {}, CreateUserDTO>, res: Response) {
        const result = await AuthenticationService.register(req.user!, req.body);
        return res.json(result);
    },

    async refreshToken(req: Request<{}, {}, RefreshTokenRequest>, res: Response) {
        const result = await AuthenticationService.refreshToken(req.cookies.refreshToken);
        return res.json(result);
    },

    async logout(req: Request<{}, {}, {}>, res: Response) {
        await AuthenticationService.logout({ userId: req.user!.userId });
        return res.json({ message: "Logged out" });
    },
};
