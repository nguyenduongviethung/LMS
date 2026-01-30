import jwt from "jsonwebtoken";
import { UserIdentity } from "@shared/src/types/user.types";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const JwtUtil = {
    generateAccessToken(user: UserIdentity): string {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

        // ⚠ JWT spec: sub PHẢI là string
        return jwt.sign(
            {
                sub: String(user.userId),
                role: user.role,
                name: user.name,
                email: user.email
            },
            secret,
            { expiresIn: "15m" }
        );
    },

    generateRefreshToken(user: UserIdentity): string {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");

        return jwt.sign(
            {
                sub: String(user.userId),
                role: user.role,
                name: user.name,
                email: user.email
            },
            secret,
            { expiresIn: "30d" }
        );
    },

    verifyAccessToken(token: string): UserIdentity {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

        try {
            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

            return {
                userId: Number(decoded.sub),
                role: decoded.role,
                name: decoded.name,
                email: decoded.email
            };
        } catch (err) {
            throw new UnauthorizedError("Refresh token is invalid or expired");
        }
    },

    verifyRefreshToken(token: string): UserIdentity {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
        if (!token) throw new UnauthorizedError("Refresh token is missing");
        
        try {
            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

            return {
                userId: Number(decoded.sub),
                role: decoded.role,
                name: decoded.name,
                email: decoded.email
            };
        } catch (err) {
            throw new UnauthorizedError("Refresh token is invalid or expired");
        }
    },
};
