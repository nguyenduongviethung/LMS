import { AttendanceStatus } from "../enums/attendance.enum"
import { SessionPublicDTO } from "./session.types";
import { UserPublicDTO } from "./user.types";

export interface AttendancePublicDTO {
    user: UserPublicDTO,
    session: SessionPublicDTO,
    status: AttendanceStatus,
    note: string
}

export interface CreateAttendanceDTO {
    status: AttendanceStatus;
    note: string;
}

export interface UpdateAttendanceDTO extends CreateAttendanceDTO {

}
