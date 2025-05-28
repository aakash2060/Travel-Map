import React from 'react';

function LandingPage({ user, onLogout }) {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button 
        onClick={onLogout}
        style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', marginTop: '20px' }}
      >
        Logout
      </button>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Your Travel Map</h2>
        <p>Here you can add your travel map with react-simple-maps</p>
      </div>
    </div>
  );
}

export default LandingPage;