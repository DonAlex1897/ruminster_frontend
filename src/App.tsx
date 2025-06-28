import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import MyRuminationsPage from './pages/MyRuminationsPage';
import MyFeedPage from './pages/MyFeedPage';
import PublicPage from './pages/PublicPage';
import UserPage from './pages/UserPage';
import ActivateAccountPage from './pages/ActivateAccountPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsOfService from './pages/TermsOfService';
import TermsAcceptance from './pages/TermsAcceptance';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';
import NewRuminationDialog from './components/NewRuminationDialog';
import TosNotification from './components/TosNotification';
import { useState } from 'react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewRuminationOpen, setIsNewRuminationOpen] = useState(false);

  return (
    <>
      <TosNotification />
      <ThemeToggle />
      <Navbar onNewRumination={() => setIsNewRuminationOpen(true)} />
      <div className="pt-16">
        <Routes>
        <Route path="/" element={<Navigate to="/public" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/activate" element={<ActivateAccountPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/terms-acceptance" element={<TermsAcceptance />} />
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
        <Route
          path="/user/:userId"
          element={
            <UserPage />
          }
        />
        </Routes>
      </div>
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
