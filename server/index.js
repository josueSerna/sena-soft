const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); 
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

// Obtener todas las localizaciones
app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener localizaciones');
    }
    res.json(results);
  });
});

// Obtener una ubicación específica por ID
app.get('/locations/:id', (req, res) => {
  const locationId = req.params.id;
  const query = 'SELECT * FROM locations WHERE id = ?';
  connection.query(query, [locationId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send("Ubicación no encontrada");
    }
    res.json(results[0]); // Enviar el primer resultado como la ubicación
  });
});

// Alquilar una bicicleta
app.post('/rent/:locationId', (req, res) => {
  const locationId = req.params.locationId;

  // Obtener la cantidad de bicicletas disponibles en la ubicación seleccionada
  const selectQuery = 'SELECT bikes FROM locations WHERE id = ?';
  connection.query(selectQuery, [locationId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send('Error al obtener la disponibilidad de bicicletas');
    }

    const availableBikes = results[0].bikes;

    if (availableBikes > 0) {
      // Si hay bicicletas disponibles, actualizamos la cantidad
      const updateQuery = 'UPDATE locations SET bikes = bikes - 1 WHERE id = ?';
      connection.query(updateQuery, [locationId], (err) => {
        if (err) {
          return res.status(500).send('Error al alquilar la bicicleta');
        }
        res.send('Bicicleta alquilada con éxito');
      });
    } else {
      res.status(400).send('No hay bicicletas disponibles en esta ubicación');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
