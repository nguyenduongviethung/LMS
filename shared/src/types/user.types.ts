import { UserRole } from "../enums/user.enum";

export interface UserIdentity {
    userId: number;
    role: UserRole; // admin | user | ...
    name: string;
    email: string;
}