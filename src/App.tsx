import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import MyRuminationsPage from './pages/MyRuminationsPage';
import MyFeedPage from './pages/MyFeedPage';
import PublicPage from './pages/PublicPage';
import ActivateAccountPage from './pages/ActivateAccountPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';
import NewRuminationDialog from './components/NewRuminationDialog';
import { useAuth } from './AuthContext';
import { useCreateRumination } from './hooks/useRuminations';
import { UserRelationType } from './types/rumination';
import React, { useState } from 'react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewRuminationOpen, setIsNewRuminationOpen] = useState(false);

  return (
    <>
      <ThemeToggle />
      <Navbar onNewRumination={() => setIsNewRuminationOpen(true)} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/activate" element={<ActivateAccountPage />} />
        <Route
          path="/my-ruminations"
          element={
            <ProtectedRoute>
              <MyRuminationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-feed"
          element={
            <ProtectedRoute>
              <MyFeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/public"
          element={
            <PublicPage />
          }
        />
      </Routes>
      <NewRuminationDialog
        isOpen={isNewRuminationOpen}
        onClose={() => setIsNewRuminationOpen(false)}
        onSuccess={() => {
          setIsNewRuminationOpen(false);
          // Refresh the current page component
          navigate(location.pathname, { replace: true });
        }}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
