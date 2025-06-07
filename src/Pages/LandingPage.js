import React, { useState, forwardRef, useImperativeHandle } from 'react';
import WorldMap from '../Components/WorldMap';
import CountryMap from '../Components/CountryMap';

const LandingPage = forwardRef(({ user, onAuthClick }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  useImperativeHandle(ref, () => ({
    resetToWorldMap: () => {
      setSelectedCountry(null);
    }
  }));

  const handleCountryClick = (country) => {
    if (!user) {
      alert('Please login to explore country maps!');
      onAuthClick();
      return;
    }
    setSelectedCountry(country);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <div style={{ marginTop: '40px' }}>
        {!selectedCountry ? (
          <>
            <h2>{user ? 'My Travel Map' : 'Travel Map Explorer'}</h2>
            <p>{user ? 'Click on a country to view and edit your travels!' : 'Explore the world map! Login to track your travels.'}</p>
            <WorldMap onCountryClick={handleCountryClick} />
          </>
        ) : (
          <CountryMap 
            country={selectedCountry} 
            user={user} 
            onBack={() => setSelectedCountry(null)} 
          />
        )}
      </div>
    </div>
  );
});

export default LandingPage;