import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { SessionPublicDTO, CreateSessionDTO, UpdateSessionDTO } from '@shared/src/types/session.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

/* ================================
   Context Type
================================ */

interface SessionContextType {
  /* ===== Sessions ===== */
  sessions: WithPermission<SessionPublicDTO>[];
  currentSession: WithPermission<SessionPublicDTO> | null;

  fetchSessions: (classId: number) => Promise<void>;
  fetchSession: (sessionId: number) => Promise<void>;
  addSession: (sessionData: CreateSessionDTO) => Promise<void>;
  updateSession: (sessionId: number, sessionData: UpdateSessionDTO) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;

}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useSession = (): SessionContextType => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
};

const convertSessionDates = (session: WithPermission<SessionPublicDTO>): WithPermission<SessionPublicDTO> => ({
  ...session,
  data: {
    ...session.data,
    createdAt: new Date(session.data.createdAt),
    updatedAt: new Date(session.data.updatedAt),
    startTime: session.data.startTime
      ? new Date(session.data.startTime)
      : null,
  }
});;

/* ================================
   Provider
================================ */

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ======================
     State
  ====================== */

  const [sessions, setSessions] = useState<WithPermission<SessionPublicDTO>[]>([]);
  const [currentSession, setCurrentSession] = useState<WithPermission<SessionPublicDTO> | null>(null);

  /* ======================
     Sessions API handlers
  ====================== */

  const fetchSessions = 
    async (classId: number) => {
      try {
        const res = await api.get<WithPermission<SessionPublicDTO>[]>(`/classes/${classId}/sessions`);
        setSessions(res.data.map(session => convertSessionDates(session)));
      } 
      catch (error) {
        handleApiError(error);
        throw error;
      }
    };

  const fetchSession = async (sessionId: number) => {
    try {
      const res = await api.get<WithPermission<SessionPublicDTO>>(`/sessions/${sessionId}`);
      setCurrentSession(res.data ? convertSessionDates(res.data) : null);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const addSession = async (sessionData: CreateSessionDTO) => {
    try {
      await api.post('/sessions', sessionData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateSession = async (sessionId: number, sessionData: UpdateSessionDTO) => {
    try {
      await api.put(`/sessions/${sessionId}`, sessionData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      await api.delete(`/sessions/${sessionId}`);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: SessionContextType = {
    sessions,
    currentSession,

    fetchSessions,
    fetchSession,
    addSession,
    updateSession,
    deleteSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};