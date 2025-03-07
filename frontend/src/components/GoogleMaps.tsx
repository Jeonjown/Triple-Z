import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
const containerStyle = {
  width: "100%",
  height: "400px",
};

const position = { lat: 14.538346625289835, lng: 121.08015422830742 };

const GoogleMaps = () => {
  return (
    <APIProvider apiKey={"AIzaSyCguQ2HPsiLR8EmuakVPV8wyftrrX-KlsE"}>
      <div style={containerStyle}>
        <Map defaultCenter={position} defaultZoom={30} mapId="904c23d6cb9a6c8">
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMaps;
