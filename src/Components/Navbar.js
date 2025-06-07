import React, { useState } from 'react';

function Navbar({ user, onHomeClick, onAuthClick, onLogout, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const handleNavSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || (isSignupMode && !formData.name)) {
      alert(`Please enter ${isSignupMode ? 'name, email and password' : 'email and password'}`);
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = isSignupMode ? '/api/register' : '/api/login';
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8010';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignupMode) {
          alert('Registration successful! You are now logged in.');
          localStorage.setItem('user', JSON.stringify({ email: formData.email, name: formData.name }));
          onLoginSuccess({ email: formData.email, name: formData.name });
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
        }
        setFormData({ email: '', password: '', name: '' });
        setIsSignupMode(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(`${isSignupMode ? 'Registration' : 'Login'} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <nav style={{
      background: '#007bff',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <button
          onClick={onHomeClick}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '5px 10px'
          }}
        >
          Travel Maps
        </button>
      </div>
      
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              style={{
                background: '#000080',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleNavSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSignupMode && (
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  padding: '6px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '100px'
                }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                padding: '6px 8px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                width: '140px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                padding: '6px 8px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                width: '110px'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isSignupMode ? '#000000' : '#000080',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '80px'
              }}
            >
              {isLoading ? (isSignupMode ? 'Signing up...' : 'Logging in...') : (isSignupMode ? 'Sign Up' : 'Login')}
            </button>
            Or 
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background:  isSignupMode ? '#000080' : '#000000',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {isSignupMode ? 'Login' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}

export default Navbar;