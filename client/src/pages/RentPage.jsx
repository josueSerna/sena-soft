import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const RentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [bikesRented, setBikesRented] = useState(1);
  const [showReturnButton, setShowReturnButton] = useState(false);

  const userId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    const rentedBikes = JSON.parse(localStorage.getItem('rentedBikes')) || {};
    if (rentedBikes[userId]) {
      setShowReturnButton(true);
    }

    axios.get(`http://localhost:3001/locations/${id}`)
      .then((response) => {
        setLocation(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la localización:", error);
      });
  }, [id, userId]);

  const handleRent = () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 86400000);
    const rentalData = {
      user_id: userId,
      location_id: location.id,
      start_date: startDate.toISOString().slice(0, 19).replace('T', ' '),
      end_date: endDate.toISOString().slice(0, 19).replace('T', ' '),
      bikes_rented: bikesRented,
    };

    axios.post('http://localhost:3001/rent', rentalData)
      .then(response => {
        setLocation(prevLocation => ({
          ...prevLocation,
          bikes: prevLocation.bikes - bikesRented,
        }));

        const rentedBikes = JSON.parse(localStorage.getItem('rentedBikes')) || {};
        rentedBikes[userId] = { bikesRented, locationId: location.id };
        localStorage.setItem('rentedBikes', JSON.stringify(rentedBikes));

        setShowReturnButton(true);
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
      bikes_returned: bikesRented,
    };

    axios.post('http://localhost:3001/return', returnData)
      .then(response => {
        alert('Bicicleta devuelta exitosamente');
        setLocation(prevLocation => ({
          ...prevLocation,
          bikes: prevLocation.bikes + bikesRented,
        }));

        const rentedBikes = JSON.parse(localStorage.getItem('rentedBikes')) || {};
        delete rentedBikes[userId];
        localStorage.setItem('rentedBikes', JSON.stringify(rentedBikes));

        setShowReturnButton(false);
        setBikesRented(1);
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
          disabled={showReturnButton}
        />
        <button
          className="btn btn-success"
          onClick={handleRent}
          disabled={showReturnButton}
        >
          Confirmar Alquiler
        </button>

        {showReturnButton && (
          <div className="text-center mt-4">
            <button className="btn btn-warning" onClick={handleReturnBike}>Bicicleta entregada</button>
          </div>
        )}

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
