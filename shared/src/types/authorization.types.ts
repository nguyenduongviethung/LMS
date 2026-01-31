export interface PermissionDTO {
    user: {
        create: boolean
    },
    class: {
        create: boolean,
        delete: boolean
    },
    content: {
        create: boolean
    },
    file: {
        create: boolean,
    }
}