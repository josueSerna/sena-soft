import React, { useState } from "react";
import axios from "axios";

const RentForm = ({ locationId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bikeCount: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a tu API
    axios.post(`http://localhost:3001/rent/${locationId}`, formData)
      .then(response => {
        alert("Alquiler registrado con éxito!");
        // Redirigir o realizar alguna acción después del envío exitoso
      })
      .catch(error => {
        console.error("Error al registrar el alquiler:", error);
      });
  };

  return (
    <div>
      <h2>Formulario de Alquiler de Bicicleta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Correo electrónico:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Cantidad de bicicletas:
            <input type="number" name="bikeCount" value={formData.bikeCount} onChange={handleChange} min="1" required />
          </label>
        </div>
        <button type="submit">Alquilar</button>
      </form>
    </div>
  );
};

export default RentForm;
