import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../common/utils/jwt.util";
import { UnauthorizedError } from "../common/errors/UnauthorizedError";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next(new UnauthorizedError());
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        next(new UnauthorizedError());
        return;
    }

    try {
        req.user = JwtUtil.verifyAccessToken(token);
        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid or expired token"));
    }
};
