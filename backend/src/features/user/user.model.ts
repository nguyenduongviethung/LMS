export interface UserIdentity {
  userId: number;
  roleName: string; // admin | user | ...
}

export interface UserPublicDTO {
  userId: number;
  name: string;
  email: string;
  phone?: string | null;
  studyPlace?: string | null;
  workPlace?: string | null;
  roleId: number;
  stateId: number;
  createdAt: Date;
}

export interface UserDetailDTO extends UserPublicDTO {
  birthDate?: Date | null;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: Date;
  studyPlace?: string;
  workPlace?: string;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  birthDate?: Date;
  studyPlace?: string;
  workPlace?: string;
}
