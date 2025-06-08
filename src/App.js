import React, { useState, useEffect, useRef } from 'react';
import AuthPage from './Pages/AuthPage';
import LandingPage from './Pages/LandingPage';
import Navbar from './Components/Navbar';
import ProfilePage from './Pages/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const landingPageRef = useRef();


  useEffect(() => {
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

   const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleBackFromProfile = () => {
    setCurrentPage('home');
  };


  return (
    <div>
      <Navbar 
        user={user}
        onHomeClick={handleHomeClick}
        onAuthClick={handleAuthClick}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
         onProfileClick={handleProfileClick}
      />
      <div>
        {currentPage === 'home' && (
          <LandingPage 
            ref={landingPageRef}
            user={user} 
            onAuthClick={handleAuthClick} 
          />
        )}
        
        {currentPage === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}
        
        {currentPage === 'profile' && user && (
          <ProfilePage 
            user={user}
            onUpdateUser={handleUpdateUser}
            onBack={handleBackFromProfile}
          />
        )}
      </div>
    </div>
  );
}

export default App;