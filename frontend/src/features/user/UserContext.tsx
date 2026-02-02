import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { UserPublicDTO, CreateUserDTO, UpdateUserDTO } from '@shared/src/types/user.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

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
     Users API handlers
  ====================== */

  const fetchUsers = async () => {
    try {
      const res = await api.get<WithPermission<UserPublicDTO>[]>('/users');
      setUsers(res.data.map(user => ({
        data: convertUserDate(user.data),
        permission: user.permission,
      })));
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const fetchUser = async (userId: number) => {
    try {
      const res = await api.get<WithPermission<UserPublicDTO>>(`/users/${userId}`);
      setCurrentUser(res.data ? {
        data: convertUserDate(res.data.data),
        permission: res.data.permission,
      } : null);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  const addUser = async (user: CreateUserDTO) => {
    try {
      await api.post<UserPublicDTO>('/users', user);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateUser = async (userId: number, userData: UpdateUserDTO) => {
    try {
      await api.put<UserPublicDTO>(`/users/${userId}`, userData);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
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