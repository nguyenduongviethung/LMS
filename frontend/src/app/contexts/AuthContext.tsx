import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../../lib/api';

interface AuthContextType {
    currentUser: User | null;
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

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState<User | null>(null);

//     const login = async (email: string, password: string) => {
//         try {
//             const res = await api.post('/api/auth/login', { email, password });

//             const { accessToken, user } = res.data;

//             localStorage.setItem('accessToken', accessToken);
//             setCurrentUser(user);
//             return true;
//         }
//         catch (e) {
//             return false;
//         }
//     };


//     const logout = () => {
//         setCurrentUser(null);
//     };

//     const value = {
//         currentUser,
//         login,
//         logout,
//         isAuthenticated: !!currentUser,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

      const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });

            const { accessToken, user } = res.data;

            localStorage.setItem('accessToken', accessToken);
            setCurrentUser(user);
            return true;
        }
        catch (e) {
            return false;
        }
    };


    const logout = () => {
        localStorage.removeItem('accessToken');
        setCurrentUser(null);
    };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/me");
        setCurrentUser(res.data);
      } catch {
        localStorage.removeItem("accessToken");
        setCurrentUser(null);
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
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
