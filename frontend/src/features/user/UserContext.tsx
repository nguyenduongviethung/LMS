import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { UserPublicDTO, CreateUserDTO, UpdateUserDTO } from '@shared/src/types/user.model';
import { WithPermission } from '@shared/src/types/permission.model';
import { api } from '../../lib/axios';

/* ================================
   Context Type
================================ */

interface UserContextType {
  /* ===== Users ===== */
  users: WithPermission<UserPublicDTO>[];
  currentUser: WithPermission<UserPublicDTO> | null;

  fetchUsers: () => Promise<void>;
  fetchUser: (userId: number) => Promise<void>
  addUser: (user: CreateUserDTO) => Promise<void>;
  updateUser: (userId: number, user: UpdateUserDTO) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;

}

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
};

/* ================================
   Provider
================================ */

const convertUserDate = <T extends { createdAt: string | Date; updatedAt: string | Date }>(
  user: T
): T & { createdAt: Date; updatedAt: Date } => {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ======================
     State
  ====================== */

  const [users, setUsers] = useState<WithPermission<UserPublicDTO>[]>([]);
  const [currentUser, setCurrentUser] = useState<WithPermission<UserPublicDTO> | null>(null);
  /* ======================
     Effects
  ====================== */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ======================
     Users API handlers
  ====================== */

  const fetchUsers = async () => {
    try {
      const res = await api.get<WithPermission<UserPublicDTO>[]>('/users');
      setUsers(res.data.map(user => ({
        data: convertUserDate(user.data),
        permission: user.permission,
      })));
    } finally {
    }
  };

  const fetchUser = async (userId: number) => {
    const res = await api.get<WithPermission<UserPublicDTO> | null>(`/users/${userId}`);
    setCurrentUser(res.data ? {
      data: convertUserDate(res.data.data),
      permission: res.data.permission,
    } : null);
  }

  const addUser = async (user: CreateUserDTO) => {
    await api.post<UserPublicDTO>('/users', user);
  };

  const updateUser = async (userId: number, userData: UpdateUserDTO) => {
    await api.put<UserPublicDTO>(`/users/${userId}`, userData);
  };

  const deleteUser = async (userId: number) => {
    await api.delete(`/users/${userId}`);
  };

  /* ======================
     Context value
  ====================== */

  const value: UserContextType = {
    users,
    currentUser,

    fetchUsers,
    fetchUser,
    addUser,
    updateUser,
    deleteUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};