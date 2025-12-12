import jwt from "jsonwebtoken";

interface User {
    id: number;
}

interface JwtPayload {
    sub: string;
}

export const JwtUtil = {
    generateAccessToken(user: User): string {
        const accessSecret = process.env.JWT_ACCESS_SECRET;
        if (!accessSecret) {
            throw new Error("JWT_ACCESS_SECRET is not defined");
        }
        return jwt.sign({ sub: user.id }, accessSecret, { expiresIn: "15m" });
    },

    generateRefreshToken(user : User): string {
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshSecret) {
            throw new Error("JWT_REFRESH_SECRET is not defined");
        }
        return jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: "30d" });
    },

    verifyRefreshToken(token: string) {
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshSecret) {
            throw new Error("JWT_REFRESH_SECRET is not defined");
        }
        return jwt.verify(token, refreshSecret);
    }
};
