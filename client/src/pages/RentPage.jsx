import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RentPage = () => {
  const { id } = useParams(); // Obtenemos el id de la URL
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Hacemos la petición al backend para obtener la localización por ID
    axios.get(`http://localhost:3001/locations/${id}`)
      .then((response) => {
        setLocation(response.data); // Guardamos la localización en el estado
      })
      .catch((error) => {
        console.error("Error al obtener la localización:", error);
      });
  }, [id]);

  if (!location) {
    return <p>Cargando...</p>; // Mostramos un mensaje mientras cargan los datos
  }

  return (
    <div>
      <h2>Alquilar bicicleta en {location.name}</h2>
      <p>Número de bicicletas disponibles: {location.bikes}</p>
      <button>Confirmar Alquiler</button> {/* Aquí podrías implementar la lógica de alquiler */}
    </div>
  );
};

export default RentPage;
