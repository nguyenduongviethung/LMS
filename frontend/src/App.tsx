import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { Layout } from './features/layout/Layout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { LoginPage } from './features/auth/LoginPage';
import { UserProvider } from './features/user/UserContext';
// import { ClassProvider } from './contexts/ClassContext';
// import { SessionProvider } from './contexts/SessionContext';
// import { LoginPage } from './pages/LoginPage';
// import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './features/user/UsersPage';
// import { ClassesPage } from './pages/ClassesPage';
// import { ProgramsPage } from './pages/ProgramsPage';
// import { SessionsPage } from './pages/SessionsPage';
// import { AttendancePage } from './pages/AttendancePage';
// import { AssignmentsPage } from './pages/AssignmentsPage';
// import { HomeworkPage } from './pages/HomeworkPage';
// import { QuizzesPage } from './pages/QuizzesPage';
// import { ReviewsPage } from './pages/ReviewsPage';
// import { TuitionsPage } from './pages/TuitionsPage';
// import { UserDetailPage } from './pages/UserDetailPage';
// import { ClassDetailPage } from './pages/ClassDetailPage';
// import { ProgramDetailPage } from './pages/ProgramDetailPage';
// import { Layout } from './components/Layout';
import { Toaster } from './ui/sonner';
// import { UserClassProvider } from './contexts/UserClassContext';
// import { AttendanceProvider } from './contexts/AttendanceContext';
// import { SessionDetailPage } from './pages/SessionDetailPage';
// import { UserClassPage } from './pages/UserClassPage';
// import { ContentProvider } from './contexts/ContentContext';

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
        {/* <Route
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
                <UserClassProvider>
                  <ClassDetailPage />
                </UserClassProvider>
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
        /> */}
        {/* <Route path="programs" element={<ProgramsPage />} />
        <Route path="programs/:programId" element={<ProgramDetailPage />} /> */}
        {/* <Route
          path="sessions"
          element={
            <ClassProvider>
              <SessionProvider>
                <SessionsPage />
              </SessionProvider>
            </ClassProvider>
          }
        /> */}
        {/* <Route
          path="sessions/:sessionId"
          element={
            <ClassProvider>
              <SessionProvider>
                <ContentProvider>
                  <SessionDetailPage />
                </ContentProvider>
              </SessionProvider>
            </ClassProvider>
          }
        /> */}
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