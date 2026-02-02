import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  use,
} from 'react';
import { ClassPublicDTO, CreateClassDTO, UpdateClassDTO } from '@shared/src/types/class.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

/* ================================
   Context Type
================================ */

interface ClassContextType {
  /* ===== Classes ===== */
  classes: WithPermission<ClassPublicDTO>[];
  currentClass: WithPermission<ClassPublicDTO> | null;

  fetchClasses: () => Promise<void>;
  fetchClass: (classId: number) => Promise<void>
  addClass: (classData: CreateClassDTO) => Promise<void>;
  updateClass: (classId: number, classData: UpdateClassDTO) => Promise<void>;
  deleteClass: (classId: number) => Promise<void>;

}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useClass = (): ClassContextType => {
  const ctx = useContext(ClassContext);
  if (!ctx) {
    throw new Error('useClass must be used within ClassProvider');
  }
  return ctx;
};

const convertClassDates = (cls: WithPermission<ClassPublicDTO>): WithPermission<ClassPublicDTO> => ({
  ...cls,
  data: {
    ...cls.data,
    createdAt: new Date(cls.data.createdAt),
    updatedAt: new Date(cls.data.updatedAt),
  }
});;

/* ================================
   Provider
================================ */

export const ClassProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ======================
     State
  ====================== */

  const [classes, setClasses] = useState<WithPermission<ClassPublicDTO>[]>([]);
  const [currentClass, setCurrrentClass] = useState<WithPermission<ClassPublicDTO> | null>(null);

  /* ======================
     Classes API handlers
  ====================== */

  const fetchClasses = async () => {
    try {
      const res = await api.get<WithPermission<ClassPublicDTO>[]>('/classes');
      setClasses(res.data.map(cls => convertClassDates(cls)));
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const fetchClass = async (classId: number) => {
    try {
      const res = await api.get<WithPermission<ClassPublicDTO> | null>(`/classes/${classId}`);
      setCurrrentClass(res.data ? convertClassDates(res.data) : null);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  const addClass = async (classData: Omit<CreateClassDTO, 'classId'>) => {
    try {
      await api.post<ClassPublicDTO>('/classes', classData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateClass = async (classId: number, classData: Partial<UpdateClassDTO>) => {
    try {
      await api.put<ClassPublicDTO>(`/classes/${classId}`, classData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteClass = async (classId: number) => {
    try {
      await api.delete(`/classes/${classId}`);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: ClassContextType = {
    classes,
    currentClass,

    fetchClasses,
    fetchClass,
    addClass,
    updateClass,
    deleteClass,
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
};