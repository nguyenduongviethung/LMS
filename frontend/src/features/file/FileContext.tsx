import React, { createContext, useContext, ReactNode } from 'react';
import { FilePublicDTO } from '@shared/src/types/file.types';
import { FileType } from '@shared/src/enums/file.enum';
import { api } from '../../lib/axios';
import { handleApiError } from '@/lib/handleApiError';

/* ================================
   Context Type
================================ */

interface FileContextType {
  /* ===== Files ===== */

  addFile: (file: File) => Promise<FilePublicDTO>;
  addLink: (link: { name: string, url: string }) => Promise<FilePublicDTO>;
  openFile: (file: FilePublicDTO) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

/* ================================
   Hook
================================ */

export const useFile = (): FileContextType => {
  const ctx = useContext(FileContext);
  if (!ctx) {
    throw new Error('useFile must be used within FileProvider');
  }
  return ctx;
};

/* ================================
   Provider
================================ */

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /* ======================
     Contents API handlers
  ====================== */

  const addFile = async (file: File): Promise<FilePublicDTO> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<FilePublicDTO>('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        ...res.data,
        uploadedAt: new Date(res.data.uploadedAt)
      };
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  const addLink = async (link: { name: string, url: string }) => {
    try {
      const res = await api.post<FilePublicDTO>('/files/link', {
        filename: link.name,
        url: link.url,
      });
      return {
        ...res.data,
        uploadedAt: new Date(res.data.uploadedAt)
      };
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };


  const openFile = async (file: FilePublicDTO) => {
    try {
      if (file.filetype === FileType.FILE) {
        const res = await api.get(
          `/files/${file.fileId}/download`,
          {
            responseType: 'blob',
          }
        );

        const blob = new Blob([res.data]);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        a.click();

        URL.revokeObjectURL(url);
      }

      if (file.filetype === FileType.LINK && file.url) {
        window.open(file.url, '_blank', 'noopener,noreferrer');
        return;
      }
    }
    catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  /* ======================
     Context value
  ====================== */

  const value: FileContextType = {
    addFile,
    addLink,
    openFile,
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};