import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "/world-map.json";

function WorldMap({ onCountryClick }) {
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
                  // Currently only USA is supported
                  if (countryName === "United States of America" || countryName === "United States") {
                    onCountryClick('USA');
                  } else {
                    alert(`${countryName} map not available yet. Only USA is currently supported.`);
                  }
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
    </div>
  );
}

export default WorldMap;