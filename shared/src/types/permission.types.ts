export interface PermissionDTO {
    canUpdate: boolean;
    canDelete: boolean;
    [key: string]: boolean;
}

export type WithPermission<T> = {
    data: T;
    permission: PermissionDTO;
};