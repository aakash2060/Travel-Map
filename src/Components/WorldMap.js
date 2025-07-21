import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "/world-map.json";

function WorldMap({ onCountryClick }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  return (
    <div style={{ border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#f0f8ff' }}>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  const countryName = geo.properties.NAME || geo.properties.name;
                  if (countryName === "United States of America" || countryName === "United States") {
                    onCountryClick('USA');
                  } 
                  else {
                    alert(`${countryName} map not available yet.`);
                  }
                }}
                onMouseEnter={(event) => {
                  const countryName = geo.properties.NAME || geo.properties.name;
                  setTooltip({
                    show: true,
                    x: event.clientX,
                    y: event.clientY,
                    content: countryName
                  });
                }}
                onMouseMove={(event) => {
                  setTooltip(prev => ({
                    ...prev,
                    x: event.clientX,
                    y: event.clientY
                  }));
                }}
                onMouseLeave={() => {
                  setTooltip({ show: false, x: 0, y: 0, content: '' });
                }}
                style={{
                  default: {
                    fill: "#D6D6DA",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none"
                  },
                  hover: {
                    fill: "#FFC107",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none",
                    cursor: "pointer"
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none"
                  }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
      
      {/* Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y - 30,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

export default WorldMap;