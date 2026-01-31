import { TaskResultStatus } from "../enums/taskResult.enum";
import { ContentPublicDTO } from "./content.types";
import { UserPublicDTO } from "./user.types";

export interface TaskResultPublicDTO {
    user: UserPublicDTO,
    content: ContentPublicDTO,
    score: number | null;
    status: TaskResultStatus,
    reviews: string;
}

export interface CreateTaskResultDTO {
    score: number | null;
    status: TaskResultStatus;
    reviews: string;
}

export interface UpdateTaskResultDTO extends CreateTaskResultDTO {

}
