import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap instalado

const RentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Inicializa useNavigate
  const [location, setLocation] = useState(null);
  const [bikesRented, setBikesRented] = useState(1);
  const [showReturnButton, setShowReturnButton] = useState(false); // Nuevo estado
  const [userRentals, setUserRentals] = useState([]); // Estado para los alquileres del usuario

  const userId = localStorage.getItem('userId') || 1; // Reemplaza esto con el valor real o mantén el valor de prueba

  useEffect(() => {
    // Recupera el estado de alquiler desde localStorage al cargar el componente
    const rentedBikes = JSON.parse(localStorage.getItem('rentedBikes')) || {};
    if (rentedBikes[userId]) {
      setShowReturnButton(true);
    }

    // Recuperar localización
    axios.get(`http://localhost:3001/locations/${id}`)
      .then((response) => {
        setLocation(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la localización:", error);
      });

    // Obtener alquileres del usuario
    axios.get(`http://localhost:3001/rentals/${userId}`)
      .then((response) => {
        setUserRentals(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los alquileres:", error);
      });
  }, [id, userId]);

  const handleRent = () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 86400000); // Alquilar por 1 día
    const rentalData = {
      user_id: userId,
      location_id: location.id,
      start_date: startDate.toISOString().slice(0, 19).replace('T', ' '),
      end_date: endDate.toISOString().slice(0, 19).replace('T', ' '),
      bikes_rented: bikesRented,
    };

    axios.post('http://localhost:3001/rent', rentalData)
      .then(response => {
        // Actualiza la cantidad de bicicletas disponibles
        setLocation(prevLocation => ({
          ...prevLocation,
          bikes: prevLocation.bikes - bikesRented, // Resta las bicicletas alquiladas
        }));

        // Guarda en localStorage que el usuario tiene bicicletas alquiladas
        const rentedBikes = JSON.parse(localStorage.getItem('rentedBikes')) || {};
        rentedBikes[userId] = { bikesRented, locationId: location.id }; // Almacena bajo el ID del usuario
        localStorage.setItem('rentedBikes', JSON.stringify(rentedBikes));

        setShowReturnButton(true); // Mostrar el botón después de alquilar
      })
      .catch(error => {
        if (error.response) {
          console.error('Error en la respuesta del servidor:', error.response.data);
        } else if (error.request) {
          console.error('Error en la solicitud:', error.request);
        } else {
          console.error('Error', error.message);
        }
      });
  };

  const handleReturnBike = () => {
    const returnData = {
      user_id: userId,
      location_id: location.id,
      bikes_returned: bikesRented, // Número de bicicletas devueltas
    };

    axios.post('http://localhost:3001/return', returnData)
      .then(response => {
        alert('Bicicleta devuelta exitosamente');

        // Actualiza la cantidad de bicicletas disponibles
        setLocation(prevLocation => ({
          ...prevLocation,
          bikes: prevLocation.bikes + bikesRented, // Suma las bicicletas devueltas
        }));

        // Elimina el estado de alquiler de localStorage
        const rentedBikes = JSON.parse(localStorage.getItem('rentedBikes')) || {};
        delete rentedBikes[userId]; // Elimina el alquiler del usuario
        localStorage.setItem('rentedBikes', JSON.stringify(rentedBikes));

        setShowReturnButton(false); // Ocultar botón después de devolver la bicicleta
        setBikesRented(1); // Restablecer el número de bicicletas alquiladas
      })
      .catch(error => {
        console.error('Error al devolver la bicicleta:', error);
      });
  };

  if (!location) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '25rem' }}>
        <h2 className="text-center">Alquilar bicicleta en {location.name}</h2>
        <p className="text-center">Número de bicicletas disponibles: {location.bikes}</p>
        <input
          type="number"
          value={bikesRented}
          onChange={(e) => setBikesRented(e.target.value)}
          min="1"
          max={location.bikes}
          className="form-control mb-3"
          disabled={showReturnButton} // Desactiva el input si el usuario tiene una bicicleta alquilada
        />
        <button
          className="btn btn-success"
          onClick={handleRent}
          disabled={showReturnButton} // Desactiva el botón de alquiler si el usuario tiene una bicicleta alquilada
        >
          Confirmar Alquiler
        </button>

        {/* Botón para devolver la bicicleta dentro del contenedor */}
        {showReturnButton && (
          <div className="text-center mt-4">
            <button className="btn btn-warning" onClick={handleReturnBike}>Bicicleta entregada</button>
          </div>
        )}

        {/* Mostrar los alquileres del usuario */}
        <h3 className="text-center mt-4">Tus Alquileres:</h3>
        <ul className="list-group">
          {userRentals.map(rental => (
            <li key={rental.id} className="list-group-item">
              Bicicleta alquilada en {rental.location_id} desde {rental.start_date} hasta {rental.end_date}
            </li>
          ))}
        </ul>

        {/* Botón para volver al mapa */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/map')}>
            Volver al Mapa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentPage;
