import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { ClassesPage } from './pages/ClassesPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { SessionsPage } from './pages/SessionsPage';
import { AttendancePage } from './pages/AttendancePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { HomeworkPage } from './pages/HomeworkPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { TuitionsPage } from './pages/TuitionsPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { ClassDetailPage } from './pages/ClassDetailPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/sonner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:userId" element={<UserDetailPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="classes/:classId" element={<ClassDetailPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="programs/:programId" element={<ProgramDetailPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="tuitions" element={<TuitionsPage />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;