import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { api } from '../../lib/axios';
import { CreateUserClassDTO, UpdateUserClassDTO, UserClassPublicDTO } from '@shared/src/types/userClass.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { UserClassRole } from '@shared/src/enums/userClass.enum';
import { handleApiError } from '@/lib/handleApiError';

/* ================================
   Context Type
================================ */

interface UserClassContextType {
  userClasses: WithPermission<UserClassPublicDTO>[];
  currentUserClass: WithPermission<UserClassPublicDTO> | null;

  fetchUserClasses: ({ userId, classId, roles }: {
    userId?: number,
    classId?: number,
    roles?: UserClassRole[]
  }) => Promise<void>;
  fetchUserClass: (userClassId: number) => Promise<void>;
  createUserClass: (userClassData: CreateUserClassDTO) => Promise<void>;
  updateUserClass: (userClassId: number, userClassData: UpdateUserClassDTO) => Promise<void>;
  deleteUserClass: (userClassId: number) => void
}


const UserClassContext = createContext<UserClassContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useUserClass = (): UserClassContextType => {
  const ctx = useContext(UserClassContext);
  if (!ctx) {
    throw new Error('useUserClass must be used within UserClassProvider');
  }
  return ctx;
};

const convertUserClassDates = (userClass: WithPermission<UserClassPublicDTO>): WithPermission<UserClassPublicDTO> => ({
  ...userClass,
  data: {
    ...userClass.data,
    user: {
      ...userClass.data.user,
      createdAt: new Date(userClass.data.user.createdAt),
      updatedAt: new Date(userClass.data.user.updatedAt),
      deletedAt: userClass.data.user.deletedAt ? new Date(userClass.data.user.deletedAt) : null,
    },
    class: {
      ...userClass.data.class,
      createdAt: new Date(userClass.data.class.createdAt),
      updatedAt: new Date(userClass.data.class.updatedAt)
    },
    enrolledAt: new Date(userClass.data.enrolledAt)
  }
});;

/* ================================
   Provider
================================ */

export const UserClassProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ======================
     State
  ====================== */
  const [userClasses, setUserClasses] = useState<WithPermission<UserClassPublicDTO>[]>([]);
  const [currentUserClass, setCurrentUserClass] = useState<WithPermission<UserClassPublicDTO> | null>(null);

  /* ======================
     UserClasses API handlers
  ====================== */
  const fetchUserClasses = async ({ userId, classId, roles }: {
    userId?: number,
    classId?: number,
    roles?: UserClassRole[]
  }) => {
    try {
      let resData: WithPermission<UserClassPublicDTO>[];
      if (classId) resData = await api.get<WithPermission<UserClassPublicDTO>[]>(
        `/classes/${classId}/users`,
        {
          params: roles && roles.length > 0
            ? { roles: roles.join(",") }
            : undefined,
        }
      ).then(res => res.data);
      else resData = await api.get<WithPermission<UserClassPublicDTO>[]>(
        `/users/${userId}/classes`,
        {
          params: roles && roles.length > 0
            ? { roles: roles.join(",") }
            : undefined,
        }
      ).then(res => res.data);

      setUserClasses(resData.map(userClass => convertUserClassDates(userClass)));
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const fetchUserClass = async (userClassId: number) => {
    try {
      const res = await api.get<WithPermission<UserClassPublicDTO> | null>(`/user-classes/${userClassId}`);
      setCurrentUserClass(res.data ? convertUserClassDates(res.data) : null);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const createUserClass = async (userClassData: CreateUserClassDTO): Promise<void> => {
    try {
      await api.post('/user-classes', userClassData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  const updateUserClass = async (userClassId: number, userClassData: UpdateUserClassDTO): Promise<void> => {
    try {
      await api.put(`/user-classes/${userClassId}`, userClassData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteUserClass = async (userClassId: number): Promise<void> => {
    try {
      await api.delete(`/user-classes/${userClassId}`);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: UserClassContextType = {
    userClasses,
    currentUserClass,
    fetchUserClasses,
    fetchUserClass,
    createUserClass,
    updateUserClass,
    deleteUserClass
  };

  return (
    <UserClassContext.Provider value={value}>
      {children}
    </UserClassContext.Provider>
  );
};