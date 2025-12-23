export interface UserIdentity {
  userId: number;
  roleName: string; // admin | user | ...
}

export interface UserPublicDTO {
  userId: number;
  name: string;
  email: string;
  phone?: string | null;
  birthDate?: Date;
  studyPlace?: string | null;
  workPlace?: string | null;
  role: {
    roleName: string;
  };
  state: {
    stateName: string;
  };
  userClasses: {
    class: {
      name: string;
    };
    role: {
      roleName: string;
    }
  }[];
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: Date;
  studyPlace?: string;
  workPlace?: string;
  roleId: number;
  stateId: number;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  birthDate?: Date;
  studyPlace?: string;
  workPlace?: string;
  roleId?: number;
  stateId?: number;
  isDeleted?: boolean | false;
}
