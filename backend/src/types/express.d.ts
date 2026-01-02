import { UserIdentity } from "backend/src/features/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserIdentity;
    }
  }
}
