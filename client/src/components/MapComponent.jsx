import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const icon = new L.Icon({
  iconUrl: "https://certificadossena.net/wp-content/uploads/2022/10/logo-sena-negro-svg-2022.svg",
  iconSize: [23, 23],
  iconAnchor: [13, 37],
  popupAnchor: [0, -38],
});

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/locations")
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las localizaciones:", error);
      });
  }, []);

  return (
    <MapContainer center={[4.60971, -74.08175]} zoom={6} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={icon}
          eventHandlers={{
            click: () => {
              setSelectedLocation(location);
            },
          }}
        >
          {selectedLocation && selectedLocation.id === location.id && (
            <Popup className="popup">
              <h3>{location.name}</h3>
              <p>Bicicletas disponibles: {location.bikes}</p>
              <Link to={`/rent/${location.id}`} className="rent-button">Alquilar aquí</Link>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
