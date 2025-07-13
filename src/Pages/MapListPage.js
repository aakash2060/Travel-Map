import React, { useState, useEffect } from 'react';
import AddMapModal from '../Components/AddMapModal';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import LandingPage from './LandingPage';

function MapsList({ user, country, onMapSelect, onBack }) {

  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

    const geoUrl = '/us-states.json'; 

  useEffect(() => {
    fetchUserMaps();
  }, [user]);

  const fetchUserMaps = async () => {
    if (!user || !user.uid){
        setLoading(false);  
        return;
    }
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

 // Early return AFTER all hooks
  if (!user) {
    return (
        <LandingPage />
    );
  }

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


  const MapPreview = ({ map }) => {
    const visitedStates = map.states || [];
    
    return (
      <div style={{ 
        height: '180px', 
        border: '1px solid #eee', 
        borderRadius: '4px', 
        overflow: 'hidden',
        background: '#f8f9fa',
        marginBottom: '15px'
      }}>
        <ComposableMap 
          projection="geoAlbersUsa"
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isVisited = visitedStates.includes(geo.properties.name);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isVisited ? "#4CAF50" : "#E0E0E0",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none"
                      },
                      hover: {
                        fill: isVisited ? "#4CAF50" : "#E0E0E0",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        
        {/* <div style={{
          position: 'relative',
          top: '-40px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          {visitedStates.length}/50 states • {((visitedStates.length / 50) * 100).toFixed(0)}% complete
        </div> */}
      </div>
    );
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
        
        <h2>My {country} Maps ({maps.length})</h2>
        
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            padding: '12px 24px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
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
               borderRadius: '12px', 
                padding: '20px', 
                background: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}>

                {/* Map Preview */}
              <MapPreview map={map} />
              
              {/* Map Info */}
              <div style={{ paddingTop: '10px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {map.mapTitle}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {map.states ? map.states.length : 0} states 
                  </span>
                  <span style={{ color: '#999', fontSize: '12px' }}>
                    {new Date(map.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div style={{ 
                  background: '#f0f0f0', 
                  height: '6px', 
                  borderRadius: '3px', 
                  overflow: 'hidden',
                  marginBottom: '15px'
                }}>
                  <div 
                    style={{ 
                      width: `${((map.states?.length || 0) / 50) * 100}%`, 
                      height: '100%', 
                      background: '#4CAF50',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={(e) => {
                      onMapSelect(map);
                    }}
                    style={{ 
                      flex: 1,
                      padding: '10px', 
                      background: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Open Map
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDeleteMap(map.mapId);
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
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