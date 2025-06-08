import React, { useState, forwardRef, useImperativeHandle } from 'react';
import WorldMap from '../Components/WorldMap';
import CountryMap from '../Components/CountryMap';
import MapsList from '../Components/MapList';

const LandingPage = forwardRef(({ user, onAuthClick }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentView, setCurrentView] = useState('world');
   const [selectedMap, setSelectedMap] = useState(null);


  useImperativeHandle(ref, () => ({
    resetToWorldMap: () => {
     setCurrentView('world');
      setSelectedCountry(null);
      setSelectedMap(null);
    }
  }));

  const handleCountryClick = (country) => {
    if (!user) {
      alert('Please login to explore country maps!');
      return;
    }
    setSelectedCountry(country);
    setCurrentView('mapsList');
  };

   const handleMapSelect = (map) => {
    setSelectedMap(map);
    setCurrentView('countryMap');
  };

  const handleBackToWorldMap = () => {
    setCurrentView('world');
    setSelectedCountry(null);
    setSelectedMap(null);
  };

  const handleBackToMapsList = () => {
    setCurrentView('mapsList');
    setSelectedMap(null);
  };

  return (
    <div style={{ maxWidth: '100vh', margin: '0 auto', padding: '5px 20px' }}>
      <div style={{ marginTop: '40px', overflow: 'hidden' }}>
      {currentView === 'world' && (
          <>
            <h2>{user ? 'My Travel Maps' : 'Travel Map Explorer'}</h2>
            <p>{user ? 'Click on a country to view and manage your travel maps!' : 'Explore the world map! Login to create and track your travels.'}</p>
            <WorldMap onCountryClick={handleCountryClick} />
          </>
        )}

        {currentView === 'mapsList' && (
          <MapsList 
            user={user}
            country={selectedCountry}
            onMapSelect={handleMapSelect}
            onBack={handleBackToWorldMap}
          />
        )}

        {currentView === 'countryMap' && (
          <CountryMap 
            country={selectedCountry}
            user={user}
            map={selectedMap}
            onBack={handleBackToMapsList}
          />
        )}
      </div>
    </div>
  );
});

export default LandingPage;