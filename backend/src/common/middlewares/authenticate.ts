import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError();
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = JwtUtil.verifyAccessToken(token);
        next();
    } catch (error) {
        throw new UnauthorizedError("Invalid or expired token");
    }
};
