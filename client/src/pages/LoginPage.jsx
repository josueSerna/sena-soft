import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import senaLogo from '../assets/sena-logo.svg'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/login', {
                email,
                password
            });

            setMessage(response.data);

            setTimeout(() => {
                navigate('/map');
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h2 className="text-center">Inicio de Sesión</h2>
                <form onSubmit={onLoginSubmit}>
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
                    <button type="submit" className="submit-button">Iniciar Sesión</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
                <div className="text-center mt-3">
                    <p>No tienes cuenta? <Link to="/" className="highlight-link">Regístrate</Link></p>
                </div>
                <div className="text-center mt-3">
                    <img src={senaLogo} alt="Logo SENA" className="sena-logo" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
