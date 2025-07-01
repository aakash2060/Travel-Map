import React, { useState, useRef, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';

function ProfileIcon({ user, onLogout, onProfileClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div 
      ref={profileRef}
      style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <span style={{ 
        color: 'white',
        fontSize: '14px',
        display: 'none' 
      }}>
        Welcome, {user.name.split(' ')[0]}
      </span>

      <button
        onClick={toggleDropdown}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#000080',
          border: '2px solid rgba(255,255,255)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'none';
        }}
        title={`${user.name} - Click for profile options`}
      >
        {getInitials(user.name)}
      </button>

      <div
        style={{
          width: '0',
          height: '0',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid rgba(255,255,255,0.7)',
          transition: 'transform 0.2s ease',
          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          cursor: 'pointer'
        }}
        onClick={toggleDropdown}
      />

      <ProfileDropdown
        user={user}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onClose={closeDropdown}
        isOpen={isDropdownOpen}
      />
    </div>
  );
}

export default ProfileIcon;