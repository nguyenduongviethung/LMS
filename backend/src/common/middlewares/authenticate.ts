import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { UserIdentity } from "@shared/src/user/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: UserIdentity;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = JwtUtil.verifyAccessToken(token);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
