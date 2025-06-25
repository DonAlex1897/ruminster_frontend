import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import ThemeToggle from './components/ThemeToggle';
import React from 'react';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ThemeToggle />
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
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
