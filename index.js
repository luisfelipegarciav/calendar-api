
const express = require('express');
const dotenv = require('dotenv');
const { dbConnection } = require('./database/config');
const cors = require('cors')

dotenv.config();

// Crear el servidor express

const app = express();

// Base de datos
dbConnection();

// cors
app.use(cors());

// Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Escuchar peticiones

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
