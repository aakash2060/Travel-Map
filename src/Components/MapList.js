import React, { useState, useEffect } from 'react';
import AddMapModal from './AddMapModal';

function MapsList({ user, country, onMapSelect, onBack }) {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUserMaps();
  }, [user.uid]);

  const fetchUserMaps = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8010';
      const response = await fetch(`${apiUrl}/api/user-maps/${user.uid}`);
      
      if (response.ok) {
        const data = await response.json();
        setMaps(data.maps || []);
      } else {
        console.error('Failed to fetch maps');
      }
    } catch (error) {
      console.error('Error fetching maps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMap = async (mapTitle) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8010';
      const response = await fetch(`${apiUrl}/api/user-maps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          mapTitle: mapTitle
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Map created:', data);
        // Refresh the maps list
        fetchUserMaps();
        setShowAddModal(false);
      } else {
        alert('Failed to create map. Please try again.');
      }
    } catch (error) {
      console.error('Error creating map:', error);
      alert('Failed to create map. Please try again.');
    }
  };

  const handleDeleteMap = async (mapId) => {
    if (!window.confirm('Are you sure you want to delete this map?')) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8010';
      const response = await fetch(`${apiUrl}/api/map/${user.uid}/${mapId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Map deleted successfully');
        // Refresh the maps list
        fetchUserMaps();
      } else {
        alert('Failed to delete map. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting map:', error);
      alert('Failed to delete map. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        <h2>Loading your maps...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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
          ← Back to World Map
        </button>
        
        <h2>{country} Travel Maps ({maps.length})</h2>
        
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            padding: '12px 24px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Add New Map
        </button>
      </div>

      {maps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No maps yet!</h3>
          <p>Create your first {country} travel map to start tracking your adventures.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              padding: '12px 24px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              borderRadius: '4px',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            Create Your First Map
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {maps.map((map) => (
            <div 
              key={map.mapId} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px', 
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{map.mapTitle}</h3>
              <p style={{ color: '#666', margin: '0 0 15px 0' }}>
                {map.states ? map.states.length : 0} states visited
              </p>
              <p style={{ color: '#999', fontSize: '12px', margin: '0 0 20px 0' }}>
                Created: {new Date(map.createdAt).toLocaleDateString()}
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => onMapSelect(map)}
                  style={{ 
                    flex: 1,
                    padding: '10px', 
                    background: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer', 
                    borderRadius: '4px' 
                  }}
                >
                  Open Map
                </button>
                <button 
                  onClick={() => handleDeleteMap(map.mapId)}
                  style={{ 
                    padding: '10px 15px', 
                    background: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer', 
                    borderRadius: '4px' 
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddMapModal 
          onAddMap={handleAddMap}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default MapsList;