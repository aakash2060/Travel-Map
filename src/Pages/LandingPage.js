import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "/us-states.json";

function LandingPage({ user, onLogout }) {
  const [visitedStates, setVisitedStates] = useState([]);
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

  const handleStateClick = async (geo) => {
    const stateName = geo.properties.name;
    const isVisited = visitedStates.includes(stateName);
    
    let newVisitedStates;
    if (isVisited) {
      newVisitedStates = visitedStates.filter(state => state !== stateName);
    } else {
      newVisitedStates = [...visitedStates, stateName];
    }
    
    setVisitedStates(newVisitedStates);
    
    try {
      setLoading(true);
      await fetch('http://localhost:8001/api/visited-states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          states: newVisitedStates
        })
      });
    } catch (error) {
      console.error('Error saving states:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Email: {user.email}</p>
        </div>
        <button 
          onClick={onLogout}
          style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', height: 'fit-content' }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>My US Travel Map</h2>
        <p>Click on states you've visited! {loading && '(Saving...)'}</p>
        
        <div style={{ border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#f0f8ff' }}>
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedStates.includes(geo.properties.name);
                  
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
                          fill: isVisited ? "#45a049" : "#FFC107",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer"
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
            <h3>States Visited ({visitedStates.length}/50):</h3>
            {visitedStates.length === 0 ? (
              <p>No states selected yet. Click on the map!</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflow: 'auto' }}>
                {visitedStates.sort().map((state) => (
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
              <p>Total states visited: <strong>{visitedStates.length}</strong></p>
              <p>Percentage of USA explored: <strong>{((visitedStates.length / 50) * 100).toFixed(1)}%</strong></p>
              <div style={{ marginTop: '10px', background: '#ddd', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${(visitedStates.length / 50) * 100}%`, 
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
    </div>
  );
}

export default LandingPage;