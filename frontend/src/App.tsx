import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { Layout } from './features/layout/Layout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { LoginPage } from './features/auth/LoginPage';
import { UserProvider } from './features/user/UserContext';
import { UsersPage } from './features/user/UsersPage';
import { Toaster } from './ui/sonner';
import { ClassProvider } from './features/class/ClassContext';
import { UserClassProvider } from './features/userClass/UserClassContext';
import { UserDetailPage } from './features/user/UserDetailPage';
import { ClassesPage } from './features/class/ClassesPage';
import { SessionProvider } from './features/session/SessionContext';
import { ClassDetailPage } from './features/class/ClassDetailPage';
import { AttendanceProvider } from './features/attendance/AttendanceContext';
import { UserClassPage } from './features/userClass/UserClassPage';
import { SessionsPage } from './features/session/SessionsPage';
import { ContentProvider } from './features/content/ContentContext';
import { FileProvider } from './features/file/FileContext';
import { SessionDetailPage } from './features/session/SessionDetailPage';

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
        <Route
          path="users"
          element={
            <UserProvider>
              <UsersPage />
            </UserProvider>
          }
        />
        <Route
          path="users/:userId"
          element={
            <UserProvider>
              <ClassProvider>
                <UserClassProvider>
                  <UserDetailPage />
                </UserClassProvider>
              </ClassProvider>
            </UserProvider>
          }
        />
        <Route
          path="classes"
          element={
            <ClassProvider>
              <ClassesPage />
            </ClassProvider>
          }
        />
        <Route
          path="classes/:classId"
          element={
            <ClassProvider>
              <SessionProvider>
                <UserProvider>
                  <UserClassProvider>
                    <ClassDetailPage />
                  </UserClassProvider>
                </UserProvider>
              </SessionProvider>
            </ClassProvider>
          }
        />
        <Route
          path="user-classes/:userClassId"
          element={
            <UserClassProvider>
              <SessionProvider>
                <AttendanceProvider>
                  <UserClassPage />
                </AttendanceProvider>
              </SessionProvider>
            </UserClassProvider>
          }
        />
        {/* <Route path="programs" element={<ProgramsPage />} />
        <Route path="programs/:programId" element={<ProgramDetailPage />} /> */}
        <Route
          path="sessions"
          element={
            <ClassProvider>
              <SessionProvider>
                <SessionsPage />
              </SessionProvider>
            </ClassProvider>
          }
        />
        <Route
          path="sessions/:sessionId"
          element={
            <ClassProvider>
              <SessionProvider>
                <ContentProvider>
                  <FileProvider>
                    <SessionDetailPage />
                  </FileProvider>
                </ContentProvider>
              </SessionProvider>
            </ClassProvider>
          }
        />
        {/* <Route
          path="attendance"
          element={
            <ClassProvider>
              <SessionProvider>
                <UserClassProvider>
                  <AttendanceProvider>
                    <AttendancePage />
                  </AttendanceProvider>
                </UserClassProvider>
              </SessionProvider>
            </ClassProvider>
          }
        /> */}
        {/* <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="tuitions" element={<TuitionsPage />} /> */}
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;