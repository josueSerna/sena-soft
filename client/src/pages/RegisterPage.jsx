import React from 'react';
import { Link } from 'react-router-dom';
import useRegister from '../hooks/useRegister';
import senaLogo from '../assets/sena-logo.svg';

const RegisterPage = () => {
  const {
    name,
    email,
    password,
    message,
    setName,
    setEmail,
    setPassword,
    onRegisterSubmit,
  } = useRegister();

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Registro de Usuario</h2>
        <form onSubmit={onRegisterSubmit} className="register-form">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">Registrarse</button>
        </form>
        {message && <p>{message}</p>}
        <p className="redirect-link">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="highlight-link">
            Inicia sesión
          </Link>
        </p>
        <img src={senaLogo} alt="SENA Logo" className="sena-logo" />
      </div>
    </div>
  );
};

export default RegisterPage;