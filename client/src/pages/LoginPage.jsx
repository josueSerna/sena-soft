import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Para redirigir después del login exitoso

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
            
            // Si el inicio de sesión es exitoso
            setMessage(response.data);
            
            // Redirigir al usuario después del inicio de sesión
            setTimeout(() => {
                navigate('/map');  // Cambia a la ruta que quieras después de iniciar sesión
            }, 2000);  // Espera 2 segundos antes de redirigir
        } catch (error) {
            setMessage(error.response?.data || 'Error al iniciar sesión');
        }
    };

    return (
        <div>
            <h2>Inicio de Sesión</h2>
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
                <button type="submit">Iniciar Sesión</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;
