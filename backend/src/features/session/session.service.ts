import { SessionRepository } from "./session.repository";
import { ForbiddenError } from "../../common/errors/ForbiddenError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { SessionPublicDTO, CreateSessionDTO, UpdateSessionDTO } from "@shared/src/types/session.types";
import { WithPermission } from "@shared/src/types/permission.types";
import { UserIdentity } from "@shared/src/types/user.types";
import { SessionPolicy } from "@/policies/session.policy";
import { ClassPolicy } from "@/policies/class.policy";

const addPermissions = async <T extends SessionPublicDTO>(currentUser: UserIdentity, session: T): Promise<WithPermission<T>> => {
    return {
        data: session,
        permission: {
            canUpdate: await SessionPolicy.manage(currentUser, session.sessionId),
            canDelete: await SessionPolicy.manage(currentUser, session.sessionId),
            canGet: await SessionPolicy.get(currentUser, session.sessionId),
            canManageAttendance: await SessionPolicy.manageAttendance(currentUser, session.sessionId),
        }
    };
};

export const SessionService = {
    async getByIdRaw(sessionId: number): Promise<SessionPublicDTO> {
        const session = await SessionRepository.findById(sessionId);
        if (!session) {
            throw new NotFoundError("SESSION.NOT_FOUND");
        }
        return session;
    },

    async getById(currentUser: UserIdentity, sessionId: number): Promise<WithPermission<SessionPublicDTO>> {
        if (!await SessionPolicy.get(currentUser, sessionId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_GET");
        }
        const session = await SessionRepository.findById(sessionId);
        if (!session) {
            throw new NotFoundError("SESSION.NOT_FOUND");
        }
        return addPermissions(currentUser, session);
    },

    async getByClassId(currentUser: UserIdentity, classId: number): Promise<WithPermission<SessionPublicDTO>[]> {
        const sessions = await SessionRepository.findByClassId(classId);
        return await Promise.all(
            sessions.map(async session => addPermissions(currentUser, session))
        );
    },

    async getByContentId(contentId: number): Promise<SessionPublicDTO[]> {
        return SessionRepository.findByContentId(contentId);
    },

    async createSession(currentUser: UserIdentity, data: CreateSessionDTO): Promise<WithPermission<SessionPublicDTO>> {
        if (!await ClassPolicy.createSession(currentUser, data.classId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_CREATE");
        }

        const session = await SessionRepository.createSesion(data);
        return addPermissions(currentUser, session);
    },

    async updateSession(currentUser: UserIdentity, sessionId: number, data: UpdateSessionDTO): Promise<WithPermission<SessionPublicDTO>> {
        if (!await SessionPolicy.manage(currentUser, sessionId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_UPDATE");
        }
        return SessionRepository.updateSession(sessionId, data).then(async (session) => {
            return addPermissions(currentUser, session);
        });
    },

    async deleteSession(currentUser: UserIdentity, sessionId: number): Promise<SessionPublicDTO> {
        if (!await SessionPolicy.manage(currentUser, sessionId)) {
            throw new ForbiddenError("SESSION.FORBIDDEN_DELETE");
        }
        const session = await SessionRepository.findById(sessionId);
        if (!session) {
            throw new NotFoundError("SESSION.NOT_FOUND");
        }
        return SessionRepository.deleteSession(sessionId);
    }
};