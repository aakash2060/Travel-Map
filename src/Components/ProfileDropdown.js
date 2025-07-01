import React from 'react';

function ProfileDropdown({ user, onLogout, onProfileClick, onClose, isOpen }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999
        }}
        onClick={handleBackdropClick}
      />
      
      {/* Dropdown Menu */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '200px',
          zIndex: 1000,
          overflow: 'hidden'
        }}
      >
        {/* User Info Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #eee',
          background: '#f8f9fa'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            {user.email}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={handleProfileClick}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span>👤</span>
            View Profile
          </button>

          <div style={{
            height: '1px',
            background: '#eee',
            margin: '4px 16px'
          }} />

          <button
            onClick={handleLogoutClick}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#dc3545',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span>🔒</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileDropdown;