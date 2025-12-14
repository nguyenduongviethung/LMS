import { Request, Response, NextFunction } from "express";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { roleName } = req.user;

    if (!allowedRoles.includes(roleName)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
