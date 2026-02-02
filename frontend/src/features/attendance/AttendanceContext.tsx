import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { AttendancePublicDTO, UpdateAttendanceDTO } from '@shared/src/types/attendance.types';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

const convertDates = (attendance: AttendancePublicDTO): AttendancePublicDTO => ({
  ...attendance,
  user: {
    ...attendance.user,
    createdAt: new Date(attendance.user.createdAt),
    updatedAt: new Date(attendance.user.updatedAt),
  },
  session: {
    ...attendance.session,
    startTime: attendance.session.startTime ? new Date(attendance.session.startTime) : null,
    createdAt: new Date(attendance.session.createdAt),
    updatedAt: new Date(attendance.session.updatedAt),
  }
})

/* ================================
   Context Type
================================ */

interface AttendanceContextType {
  attendances: AttendancePublicDTO[];
  fetchSessionAttendance: (sessionId: number) => Promise<void>;
  fetchUserClassAttendance: (userClassId: number) => Promise<void>;
  updateAttendance: (sessionId: number, userId: number, data: UpdateAttendanceDTO) => Promise<void>;
  ensureAttendance: (sessionId: number) => Promise<void>
}


const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useAttendance = (): AttendanceContextType => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return ctx;
};

/* ================================
   Provider
================================ */

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ======================
     State
  ====================== */
  const [attendances, setAttendances] = useState<AttendancePublicDTO[]>([]);

  /* ======================
     Attendances API handlers
  ====================== */

  const fetchSessionAttendance = async (
    sessionId: number
  ): Promise<void> => {
    try {
      const res = await api.get<AttendancePublicDTO[]>(`/sessions/${sessionId}/attendance`);
      setAttendances(res.data.map(attendance => convertDates(attendance)));
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const fetchUserClassAttendance = async (userClassId: number): Promise<void> => {
    try {
      const res = await api.get<AttendancePublicDTO[]>(`/user-classes/${userClassId}/attendance`);
      setAttendances(res.data.map(attendance => convertDates(attendance)));
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  const updateAttendance = async (sessionId: number, userId: number, data: UpdateAttendanceDTO): Promise<void> => {
    try {
      await api.put(`/sessions/${sessionId}/users/${userId}/attendance`, data);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const ensureAttendance = async (sessionId: number): Promise<void> => {
    try {
      await api.post(`/sessions/${sessionId}/attendance/ensure`);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: AttendanceContextType = {
    attendances,
    fetchSessionAttendance,
    fetchUserClassAttendance,
    updateAttendance,
    ensureAttendance,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};