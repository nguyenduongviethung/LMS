import { UserIdentity } from "@shared/src/types/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserIdentity;
    }
  }
}
