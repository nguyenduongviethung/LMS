import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TaskResultPublicDTO, UpdateTaskResultDTO } from '@shared/src/types/taskResult.types';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

const convertDate = (taskResult: TaskResultPublicDTO) => ({
  ...taskResult,
  user: {
    ...taskResult.user,
    createdAt: new Date(taskResult.user.createdAt),
    updatedAt: new Date(taskResult.user.updatedAt),
  },
  content: {
    ...taskResult.content,
    createdAt: new Date(taskResult.content.createdAt),
    updatedAt: new Date(taskResult.content.updatedAt),
  }
});

/* ================================
   Context Type
================================ */

interface TaskResultContextType {
  taskResults: TaskResultPublicDTO[];
  fetchSessionContentTaskResult: (sessionId: number, contentId: number) => Promise<void>;
  fetchUserClassTaskResult: (userClassId: number) => Promise<void>;
  updateTaskResult: (contentId: number, userId: number, data: UpdateTaskResultDTO) => Promise<void>;
  ensureTaskResult: (sessionId: number, contentId: number) => Promise<void>
}


const TaskResultContext = createContext<TaskResultContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useTaskResult = (): TaskResultContextType => {
  const ctx = useContext(TaskResultContext);
  if (!ctx) {
    throw new Error('useTaskResult must be used within TaskResultProvider');
  }
  return ctx;
};

/* ================================
   Provider
================================ */

export const TaskResultProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ======================
     State
  ====================== */
  const [taskResults, setTaskResults] = useState<TaskResultPublicDTO[]>([]);

  /* ======================
     TaskResults API handlers
  ====================== */

  const fetchSessionContentTaskResult = async (sessionId: number, contentId: number): Promise<void> => {
    const res = await api.get<TaskResultPublicDTO[]>(`/sessions/${sessionId}/contents/${contentId}/task-result`);
    setTaskResults(res.data.map(taskResult => convertDate(taskResult)));
  };

  const fetchUserClassTaskResult = async (
    userClassId: number
  ): Promise<void> => {
    try {
      const res = await api.get<TaskResultPublicDTO[]>(`/user-classes/${userClassId}/taskResult`);
      setTaskResults(res.data.map(taskResult => convertDate(taskResult)));
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateTaskResult = async (contentId: number, userId: number, data: UpdateTaskResultDTO): Promise<void> => {
    try {
      await api.put(
        `/contents/${contentId}/users/${userId}/task-result`,
        data
      );
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const ensureTaskResult = async (sessionId: number, contentId: number): Promise<void> => {
    try {
      await api.post<TaskResultPublicDTO[]>(
        `/sessions/${sessionId}/contents/${contentId}/task-result/ensure`
      );
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: TaskResultContextType = {
    taskResults,
    fetchSessionContentTaskResult,
    fetchUserClassTaskResult,
    updateTaskResult,
    ensureTaskResult,
  };

  return (
    <TaskResultContext.Provider value={value}>
      {children}
    </TaskResultContext.Provider>
  );
};