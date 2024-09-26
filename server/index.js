const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); 

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sena_bikes_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar la base de datos', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Ruta para verificar si el usuario ya existe
app.post('/checkUser', (req, res) => {
  const { name, email } = req.body;

  const query = 'SELECT * FROM users WHERE name = ? OR email = ?';
  connection.query(query, [name, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.status(409).json({ exists: true, message: 'Usuario ya existente' });
    } else {
      return res.json({ exists: false });
    }
  });
});

// Endpoint para registrar un nuevo usuario
app.post('/create', (req, res) => {
  const { name, email, password } = req.body;

  const checkQuery = 'SELECT * FROM users WHERE name = ? OR email = ?';
  connection.query(checkQuery, [name, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    } else {
      const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      connection.query(insertQuery, [name, email, password], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al registrar el usuario' });
        }

        return res.json('Usuario registrado exitosamente');
      });
    }
  });
});

// Endpoint para inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send('Error al verificar las credenciales');
    }

    if (results.length > 0) {
      res.send('Inicio de sesión exitoso');
    } else {
      res.status(401).send('Email o contraseña incorrectos');
    }
  });
});

// Ruta para obtener todas las localizaciones
app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener localizaciones');
    }
    res.json(results);
  });
});

// Ruta para obtener una localización por ID
app.get('/locations/:id', (req, res) => {
  const { id } = req.params; // Obtiene el ID de la URL
  const query = 'SELECT * FROM locations WHERE id = ?'; // Consulta parametrizada

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener la localización:', err);
      return res.status(500).send('Error al obtener la localización');
    }
    if (results.length === 0) {
      return res.status(404).send('Localización no encontrada'); // Manejo del caso en que no se encuentra la localización
    }
    res.json(results[0]); // Enviamos la localización encontrada
  });
});

// Endpoint para alquilar una bicicleta
app.post('/rent', (req, res) => {
  const { user_id, location_id, bikes_rented, start_date, end_date } = req.body;

  // Verificar que todos los campos necesarios estén presentes
  if (!user_id || !location_id || !bikes_rented || !start_date || !end_date) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Insertar el nuevo alquiler en la base de datos
  const insertQuery = 'INSERT INTO rentals (user_id, location_id, bikes_rented, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
  
  connection.query(insertQuery, [user_id, location_id, bikes_rented, start_date, end_date], (err, result) => {
    if (err) {
      console.error('Error al registrar el alquiler:', err);
      return res.status(500).json({ message: 'Error al realizar el alquiler' });
    }

    // Actualizar la cantidad de bicicletas en la ubicación
    const updateQuery = 'UPDATE locations SET bikes = bikes - ? WHERE id = ?';
    connection.query(updateQuery, [bikes_rented, location_id], (err) => {
      if (err) {
        console.error('Error al actualizar la cantidad de bicicletas:', err);
        return res.status(500).json({ message: 'Error al actualizar la cantidad de bicicletas' });
      }

      return res.json({ message: 'Alquiler realizado exitosamente' });
    });
  });
});

// Endpoint para devolver una bicicleta
app.post('/return', (req, res) => {
  const { user_id, location_id, bikes_returned } = req.body;

  // Verificar que todos los campos necesarios estén presentes
  if (!user_id || !location_id || !bikes_returned) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Actualizar la cantidad de bicicletas en la ubicación
  const updateQuery = 'UPDATE locations SET bikes = bikes + ? WHERE id = ?';
  connection.query(updateQuery, [bikes_returned, location_id], (err) => {
    if (err) {
      console.error('Error al actualizar la cantidad de bicicletas:', err);
      return res.status(500).json({ message: 'Error al devolver la bicicleta' });
    }

    return res.json({ message: 'Bicicleta devuelta exitosamente' });
  });
});

// Ruta para obtener los alquileres del usuario
app.get('/rentals/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM rentals WHERE user_id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
