import { UserIdentity } from "../../features/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserIdentity;
    }
  }
}
