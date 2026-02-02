export interface UserPermissionDTO {
    user: {
        create: boolean
    };
    class: {
        create: boolean,
        delete: boolean
    };
    session: {
        create: boolean,
    };
    content: {
        create: boolean
    };
    file: {
        create: boolean,
    };
}

export interface PermissionDTO {
    canUpdate: boolean;
    canDelete: boolean;
    [key: string]: boolean;
}

export type WithPermission<T> = {
    data: T;
    permission: PermissionDTO;
};