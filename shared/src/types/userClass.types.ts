import { UserPublicDTO } from "./user.types";
import { ClassPublicDTO } from "./class.types";
import { UserClassRole } from "../enums/userClass.enum";

export interface UserClassPublicDTO {
    userClassId: number;
    user: UserPublicDTO;
    class: ClassPublicDTO;
    role: UserClassRole;
    enrolledAt: Date;
    deletedAt: Date | null;
}