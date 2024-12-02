import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser'; // Importación de body-parser
import mysql from 'mysql2'; // Importación de mysql2

const app = express();
const port = 3030;

// Configura el directorio actual (para resolver rutas)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
//app.use(express.static('public'));


/*
// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Cambia esto según tu usuario de MySQL
  password: '',           // Cambia esto según tu contraseña
  database: 'proyecto'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL.');
  }
});*/
// Sirve archivos estáticos desde la carpeta 'public'
//app.use(express.static(path.join(__dirname, 'public')));


// Ruta para la vista de presupuesto de ingresos
app.get('/ingresos', (req, res) => {
  res.render('ingresos');
});

// Ruta para procesar el la paantalla de bienbenida 
app.get('/index', (req , res)=> {
  res.render('index');
});

// Ruta para procesar el formulario
app.get('/inicio', (req , res)=> {
  res.render('inicio');
});

// Ruta para procesar el formulario
app.get('/formulario', (req , res)=> {
  res.render('formularios');
});

app.get('/egresos', (req , res)=> {
  res.render('egresos');
});

app.get('/neteo', (req , res)=> {
  res.render('neteo');
});

app.get('/basesDatos', (req , res)=> {
  res.render('basesDatos');
})




/*
// Ruta para procesar el formulario
app.post('/guardar', (req, res) => {
  const {
    fecha,
    producto,
    precio_unitario,
    tipo_venta,
    inversion_publicidad,
    garantia,
    edad_segmento,
    genero_sector,
    puntos_venta,
    canales_distribucion,
    tiempos_entrega,
    capital_inicial,
    ubicacion,
    competidores
  } = req.body;

  // Insertar datos en la base de datos
  const query = `
    INSERT INTO companias 
    (fecha, producto, precio_unitario, tipo_venta, inversion_publicidad, garantia, 
     edad_segmento, genero_sector, puntos_venta, canales_distribucion, tiempos_entrega, 
     capital_inicial, ubicacion, competidores) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    fecha,
    producto,
    precio_unitario,
    tipo_venta,
    inversion_publicidad,
    garantia,
    edad_segmento,
    genero_sector,
    puntos_venta,
    canales_distribucion,
    tiempos_entrega,
    capital_inicial,
    ubicacion,
    competidores === 'on' ? 1 : 0 // Convertir checkbox a booleano
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Error al guardar en la base de datos:', err);
      res.send('Hubo un error al guardar los datos.');
    } else {
      res.send('Datos guardados correctamente.');
    }
  });
});
*/
// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
