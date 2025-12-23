import jwt from "jsonwebtoken";
import { UserIdentity } from "@shared/src/user/user.model";

export const JwtUtil = {
    generateAccessToken(user: UserIdentity): string {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

        // ⚠ JWT spec: sub PHẢI là string
        return jwt.sign(
            {
                sub: String(user.userId),
                roleName: user.roleName,
            },
            secret,
            { expiresIn: "15m" }
        );
    },

    generateRefreshToken(user: UserIdentity): string {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");

        return jwt.sign(
            { sub: String(user.userId) },
            secret,
            { expiresIn: "30d" }
        );
    },

    verifyAccessToken(token: string): UserIdentity {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        return {
            userId: Number(decoded.sub),
            roleName: decoded.roleName as string,
        };
    },

    verifyRefreshToken(token: string): UserIdentity {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");

        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        return {
            userId: Number(decoded.sub),
            roleName: decoded.roleName as string,
        };
    },
};
