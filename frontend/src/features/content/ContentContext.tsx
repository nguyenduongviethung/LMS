import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ContentPublicDTO, CreateContentDTO, UpdateContentDTO } from '@shared/src/types/content.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

/* ================================
   Context Type
================================ */

interface ContentContextType {
  /* ===== Contents ===== */
  contents: WithPermission<ContentPublicDTO>[];

  fetchContents: (sessionId: number) => Promise<void>;
  addContent: (content: CreateContentDTO) => Promise<ContentPublicDTO>;
  updateContent: (contentId: number, content: UpdateContentDTO) => Promise<void>;
  attachContent: (sessionId: number, contentId: number) => Promise<void>;
  detachContent: (sessionId: number, contentId: number) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useContent = (): ContentContextType => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return ctx;
};

const convertContentDates = (content: WithPermission<ContentPublicDTO>): WithPermission<ContentPublicDTO> => ({
  ...content,
  data: {
    ...content.data,
    createdAt: new Date(content.data.createdAt),
    updatedAt: new Date(content.data.updatedAt),
    deadline: content.data.deadline ? new Date(content.data.deadline) : null,
  }
});;

/* ================================
   Provider
================================ */

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /* ======================
     State
  ====================== */

  const [contents, setContents] = useState<WithPermission<ContentPublicDTO>[]>([]);

  /* ======================
     Contents API handlers
  ====================== */

  const fetchContents = async (sessionId: number) => {
    try {
      const res = await api.get<WithPermission<ContentPublicDTO>[]>(`/sessions/${sessionId}/contents`);
      setContents(res.data.map(content => convertContentDates(content)));
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const addContent = async (content: CreateContentDTO) => {
    try {
      const res = await api.post<ContentPublicDTO>('/contents', content);
      return {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
        deadline: res.data.deadline ? new Date(res.data.deadline) : null
      };
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateContent = async (contentId: number, contentData: UpdateContentDTO) => {
    try {
      await api.put(`/contents/${contentId}`, contentData);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const attachContent = async (sessionId: number, contentId: number) => {
    try {
      await api.post(`/session-contents/`, {
        sessionId,
        contentId,
      });
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const detachContent = async (sessionId: number, contentId: number) => {
    try {
      await api.delete(`/session-contents/${sessionId}/${contentId}`);
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: ContentContextType = {
    contents,

    fetchContents,
    addContent,
    updateContent,
    attachContent,
    detachContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};