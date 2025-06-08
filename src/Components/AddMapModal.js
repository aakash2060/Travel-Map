import React, { useState } from 'react';

function AddMapModal({ onAddMap, onClose }) {
  const [mapTitle, setMapTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mapTitle.trim()) {
      alert('Please enter a map title');
      return;
    }

    setIsLoading(true);
    try {
      await onAddMap(mapTitle.trim());
    } catch (error) {
      console.error('Error in modal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Suggested map titles
  const suggestions = [
    "Places I've Eaten Amazing Food",
    "States I Want to Visit This Year",
    "Business Travel Locations",
    "Family Vacation Spots",
    "Road Trip 2024",
    "Weekend Getaway Ideas",
    "National Parks I've Visited",
    "College Road Trip"
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999'
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: '20px', color: '#333' }}>Create New Travel Map</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Map Title:
            </label>
            <input
              type="text"
              value={mapTitle}
              onChange={(e) => setMapTitle(e.target.value)}
              placeholder="Enter a descriptive title for your map..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              autoFocus
              maxLength={100}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              {mapTitle.length}/100 characters
            </small>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#666' }}>
              Need inspiration? Try one of these:
            </label>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              maxHeight: '120px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
              backgroundColor: '#fafafa'
            }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMapTitle(suggestion)}
                  style={{
                    padding: '6px 12px',
                    background: '#e9ecef',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#495057',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e9ecef';
                    e.target.style.color = '#495057';
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !mapTitle.trim()}
              style={{
                padding: '12px 20px',
                background: mapTitle.trim() ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: mapTitle.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Creating...' : 'Create Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMapModal;