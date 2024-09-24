import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    
    const onRegisterSubmit = async (e) =>{
        e.preventDefault()
        const newUser ={ name, email, password }

        try {
            const response = await axios.post('http://localhost:3001/create', newUser);
            setMessage(response.data)

            setTimeout(() => {
                navigate('login')
            }, 2000)
        }catch {
            setMessage('Error al resgistrar el usuario')
        }
    }
    return (
        <div>
          <h2>Registro de Usuario</h2>
          <form onSubmit={onRegisterSubmit}>
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
            <button type="submit">Registrarse</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      );  
}

export default RegisterPage
