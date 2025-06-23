import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import React, { useEffect, useState } from 'react';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <button
      onClick={toggleDark}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-primary text-white dark:bg-background-dark dark:text-accent transition-colors duration-300 focus:outline-none"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.635-7.64 6.374-9.123a.75.75 0 01.976.937A7.501 7.501 0 0019.5 15.75a.75.75 0 01.937.976z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485l-1.06 1.06M4.515 4.515l1.06 1.06M21 12h-1.5M4.5 12H3m15.485 4.485l-1.06-1.06M4.515 19.485l1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      )}
    </button>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeToggle />
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
  );
}

export default App;
