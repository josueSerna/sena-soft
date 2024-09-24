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


app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener localizaciones');
    }
    res.json(results);
  });
});


app.post('/create', (req, res) => {
  const { name, email, password } = req.body; 
  if (!name || !email || !password) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  const insertUser = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const values = [name, email, password];

  connection.query(insertUser, values, (err, results) => {
    if (err) {
      return res.status(500).send('Error al crear el usuario');
    } else {
      res.send('Usuario registrado exitosamente');
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?'
  connection.query(query, [email, password], (err, results) => {
      if (err) {
          return res.status(500).send('Error al verificar las credenciales');
      }

      // Verifica si se encontró algún resultado
      if (results.length > 0) {
          res.send('Inicio de sesión exitoso');
      } else {
          res.status(401).send('Email o contraseña incorrectos');
      }
  });
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
