import  { useState } from 'react';
import WorldMap from '../Components/WorldMap';
import CountryMap from '../Components/CountryMap';

function LandingPage({ user, onLogout }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

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
        {!selectedCountry ? (
          <>
            <h2>My Travel Map</h2>
            <p>Click on a country to view and edit your travels!</p>
            <WorldMap onCountryClick={setSelectedCountry} />
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
}

export default LandingPage;