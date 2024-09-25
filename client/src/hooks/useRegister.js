import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/;

  const onRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setMessage('El correo electrónico debe ser de Gmail o Hotmail y terminar en .com');
      return;
    }

    const newUser = { name, email, password };

    try {
      const response = await axios.post('http://localhost:3001/create', newUser);
      setMessage(response.data);
      
      if (response.data === 'Usuario registrado exitosamente') {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }

    } catch (error) {
      // Mostrar el mensaje de error recibido del servidor
      setMessage(error.response?.data || 'Error al registrar el usuario');
    }
  };

  return {
    name,
    email,
    password,
    message,
    setName,
    setEmail,
    setPassword,
    onRegisterSubmit,
  };
};

export default useRegister;
