import { UserIdentity } from "@shared/src/types/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserIdentity;
    }
  }
}
