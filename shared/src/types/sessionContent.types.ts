import { ContentPublicDTO } from "./content.types";
import { SessionPublicDTO } from "./session.types";

export interface SessionContentPublicDTO {
    session: SessionPublicDTO;
    content: ContentPublicDTO;
}

export interface CreateSessionContentDTO {
    sessionId: number;
    contentId: number;   
}