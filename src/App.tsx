import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import MyRuminationsPage from './pages/MyRuminationsPage';
import MyFeedPage from './pages/MyFeedPage';
import PublicPage from './pages/PublicPage';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';
import NewRuminationDialog from './components/NewRuminationDialog';
import { useAuth } from './AuthContext';
import { createRumination } from './services/RuminationsService';
import { UserRelationType } from './types/rumination';
import React, { useState } from 'react';

function AppContent() {
  const { token } = useAuth();
  const [isNewRuminationOpen, setIsNewRuminationOpen] = useState(false);

  const handleNewRumination = async (content: string, audiences: UserRelationType[], publish: boolean) => {
    if (!token) return;
    
    await createRumination(token, {
      content,
      audiences: audiences.length > 0 ? audiences : undefined,
      publish
    });
    
    // Refresh the current page by reloading
    window.location.reload();
  };

  return (
    <>
      <ThemeToggle />
      <Navbar onNewRumination={() => setIsNewRuminationOpen(true)} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
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
            <ProtectedRoute>
              <PublicPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <NewRuminationDialog
        isOpen={isNewRuminationOpen}
        onClose={() => setIsNewRuminationOpen(false)}
        onSubmit={handleNewRumination}
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
