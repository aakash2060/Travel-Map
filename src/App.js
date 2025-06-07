import React, { useState, useEffect } from 'react';
import AuthPage from './Pages/AuthPage';
import LandingPage from './Pages/LandingPage';
import Navbar from './Components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  // Debug: Log state changes
  console.log('Current page:', currentPage);
  console.log('User:', user);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log('Login success called');
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    console.log('Logout called');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  const handleHomeClick = () => {
    console.log('Home click called');
    setCurrentPage('home');
  };

  const handleAuthClick = () => {
    console.log('Auth click called');
    setCurrentPage('auth');
  };

  return (
    <div>
      <Navbar 
        user={user}
        onHomeClick={handleHomeClick}
        onAuthClick={handleAuthClick}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />
      <div>
        {currentPage === 'home' ? (
          <LandingPage user={user} onAuthClick={handleAuthClick} />
        ) : (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;