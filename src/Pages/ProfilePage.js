import React, { useState } from 'react';

function ProfilePage({ user, onUpdateUser, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Basic validation
      if (!formData.name.trim()) {
        alert('Name is required');
        return;
      }

      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }

      // Here you would make API call to update user profile
      // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8010';
      // const response = await fetch(`${apiUrl}/api/user/${user.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword
      //   })
      // });

      // For now, just update locally
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email
      };

      onUpdateUser(updatedUser);
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px'
      }}>
        <button 
          onClick={onBack}
          style={{ 
            padding: '10px 20px', 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '4px' 
          }}
        >
          ← Back
        </button>
        
        <h2 style={{ margin: 0, color: '#333' }}>My Profile</h2>
        
        <div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ 
                padding: '10px 20px', 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                borderRadius: '4px' 
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                style={{ 
                  padding: '10px 20px', 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  borderRadius: '4px' 
                }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                style={{ 
                  padding: '10px 20px', 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  borderRadius: '4px' 
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>User Profile</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Full Name:
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <p style={{ 
                padding: '10px', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                margin: 0,
                border: '1px solid #e9ecef'
              }}>
                {user.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email Address:
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <p style={{ 
                padding: '10px', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                margin: 0,
                border: '1px solid #e9ecef'
              }}>
                {user.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              User ID:
            </label>
            <p style={{ 
              padding: '10px', 
              background: '#f8f9fa', 
              borderRadius: '4px',
              margin: 0,
              border: '1px solid #e9ecef',
              fontSize: '12px',
              color: '#666',
              fontFamily: 'monospace'
            }}>
              {user.uid}
            </p>
          </div>
        </div>

        {/* Password Change Section */}
        {isEditing && (
          <div style={{ 
            borderTop: '1px solid #eee', 
            paddingTop: '30px',
            marginTop: '30px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Change Password</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Leave password fields empty if you don't want to change your password.
            </p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Current Password:
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                New Password:
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Confirm New Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;