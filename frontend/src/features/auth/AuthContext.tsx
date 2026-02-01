import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserIdentity } from '@shared/src/types/user.types';
import { api } from '../../lib/axios';
import { UserPermissionDTO } from '@shared/src/types/permission.types';

interface AuthContextType {
  currentUser: UserIdentity | null;
  permissions: UserPermissionDTO | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserIdentity | null>(null);
  const [permissions, setPermissions] = useState<UserPermissionDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      const { accessToken, user } = res.data;

      localStorage.setItem('accessToken', accessToken);
      setCurrentUser(user);

      const permRes = await api.get('/auth/me/permissions');
      setPermissions(permRes.data);
      return true;
    }
    catch (e) {
      return false;
    }
  };


  const logout = () => {
    localStorage.removeItem('accessToken');
    setCurrentUser(null);
    setPermissions(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [meRes, permRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/auth/me/permissions'),
        ]);

        setCurrentUser(meRes.data);
        setPermissions(permRes.data);
      } catch {
        localStorage.removeItem("accessToken");
        setCurrentUser(null);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        permissions,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
