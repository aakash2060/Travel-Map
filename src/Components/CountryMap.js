import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "/us-states.json";

function CountryMap({ country, user, onBack }) {
  const [visitedStates, setVisitedStates] = useState([]);
  const [tempVisitedStates, setTempVisitedStates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVisitedStates();
  }, []);

  const fetchVisitedStates = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/visited-states/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setVisitedStates(data.states || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleStateClick = (geo) => {
    if (!isEditing) return;
    
    const stateName = geo.properties.name;
    const isVisited = tempVisitedStates.includes(stateName);
    
    if (isVisited) {
      setTempVisitedStates(tempVisitedStates.filter(state => state !== stateName));
    } else {
      setTempVisitedStates([...tempVisitedStates, stateName]);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempVisitedStates([...visitedStates]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
     const response = await fetch('http://localhost:8001/api/visited-states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          states: tempVisitedStates
        })
      });
       if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      
      const data = await response.json();
      console.log('States saved successfully:', data);
      setVisitedStates(tempVisitedStates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving states:', error);
      alert('Failed to save states. Please try again.'+ error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempVisitedStates([]);
  };

  const currentStates = isEditing ? tempVisitedStates : visitedStates;

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          ← Back to World Map
        </button>
        
        <h2>{country} Travel Map</h2>
        
        <div>
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            >
              Edit
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave}
                disabled={loading}
                style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginRight: '10px' }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      
      {isEditing && (
        <p style={{ textAlign: 'center', color: '#007bff', marginBottom: '10px' }}>
          Click on states to mark/unmark them as visited
        </p>
      )}
      
      <div style={{ border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#f0f8ff' }}>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isVisited = currentStates.includes(geo.properties.name);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleStateClick(geo)}
                    style={{
                      default: {
                        fill: isVisited ? "#4CAF50" : "#D6D6DA",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      hover: {
                        fill: isEditing ? (isVisited ? "#45a049" : "#FFC107") : (isVisited ? "#4CAF50" : "#D6D6DA"),
                        stroke: "#FFFFFF",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: isEditing ? "pointer" : "default"
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>States Visited ({currentStates.length}/50):</h3>
          {currentStates.length === 0 ? (
            <p>No states visited yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflow: 'auto' }}>
              {currentStates.sort().map((state) => (
                <li key={state} style={{ margin: '5px 0', padding: '5px', background: '#e8f5e9', borderRadius: '4px' }}>
                  ✓ {state}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h3>Travel Statistics:</h3>
          <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <p>Total states visited: <strong>{currentStates.length}</strong></p>
            <p>Percentage of {country} explored: <strong>{((currentStates.length / 50) * 100).toFixed(1)}%</strong></p>
            <div style={{ marginTop: '10px', background: '#ddd', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(currentStates.length / 50) * 100}%`, 
                  height: '100%', 
                  background: '#4CAF50',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryMap;