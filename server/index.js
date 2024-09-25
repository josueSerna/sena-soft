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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
