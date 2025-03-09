import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const position = { lat: 14.538346625289835, lng: 121.08015422830742 };

const GoogleMaps = () => {
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

  console.log(apiKey);

  return (
    <APIProvider apiKey={apiKey}>
      <div style={containerStyle}>
        <Map defaultCenter={position} defaultZoom={30} mapId={mapId}>
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMaps;
