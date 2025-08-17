import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DialogProvider } from './contexts/DialogContext';
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
import Navbar from './components/Navbar';
import NewRuminationDialog from './components/NewRuminationDialog';
import TosNotification from './components/TosNotification';
import { TokenDebugInfo } from './components/TokenDebugInfo';
import { useDialog } from './contexts/DialogContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <>
      <TosNotification />
    <Navbar onNewRumination={() => openDialog('new-rumination')} />
      <div className="pt-16 pb-16 md:pb-0 md:pl-20">
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
        isOpen={isDialogOpen('new-rumination')}
        onClose={() => closeDialog('new-rumination')}
        onSuccess={() => {
          closeDialog('new-rumination');
          // Refresh the current page component
          navigate(location.pathname, { replace: true });
        }}
      />
      
      {/* Development debug component */}
      {process.env.NODE_ENV === 'development' && <TokenDebugInfo />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <DialogProvider>
            <AppContent />
          </DialogProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
