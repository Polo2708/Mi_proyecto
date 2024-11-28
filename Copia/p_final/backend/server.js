const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); // Para encriptar y comparar contraseñas
const jwt = require("jsonwebtoken"); // Para generar tokens JWT
const multer = require("multer"); // Para manejar la carga de archivos
const path = require("path"); // Para manejar rutas de archivos

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Renombrar el archivo para evitar duplicados
  },
});

const upload = multer({ storage }); // Middleware de multer

// Clave secreta para JWT
const jwtSecret = '27082004';

// Conexión a la base de datos sports_store
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sports_store",
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err.message);
    return;
  }
  console.log("Conectado a la base de datos MySQL sports_store");
});

// Servir las imágenes desde el directorio 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta para obtener productos (ejemplo estático)
app.get('/api/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Ruta para actualizar un producto
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion } = req.body;
  const sql = 'UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?';
  db.query(sql, [nombre, precio, descripcion, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Producto actualizado correctamente" });
  });
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM productos WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Producto eliminado correctamente" });
  });
});

// Ruta de registro de usuarios
app.post("/register", async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Verificar si el email ya existe
  const queryCheck = "SELECT * FROM usuarios WHERE email = ?";
  db.query(queryCheck, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en la base de datos" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "El usuario con ese email ya existe" });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar nuevo usuario en la base de datos
    const queryInsert = "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)";
    db.query(queryInsert, [nombre, email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al registrar el usuario" });
      }
      return res.status(201).json({ message: "Usuario registrado exitosamente" });
    });
  });
});

// Ruta de inicio de sesión (Login con JWT)
app.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Verificar si el usuario existe por email
  const queryCheck = "SELECT * FROM usuarios WHERE email = ?";
  db.query(queryCheck, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en la base de datos" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({ message: "Inicio de sesión exitoso", token });
  });
});

// Ruta para agregar productos
app.post('/api/productos', upload.array('images', 4), (req, res) => {
  console.log(req.body); // Verifica que los datos del formulario se están enviando correctamente
  console.log(req.files); // Verifica que las imágenes se están subiendo correctamente

  const { nombre, precio, descripcion, categoria, stock, marca } = req.body;
  
  // Obtener los nombres de los archivos de imagen
  const imagenes = req.files ? req.files.map(file => file.filename) : []; // Array de nombres de archivos

  const sql = 'INSERT INTO productos (nombre, precio, descripcion, categoria, stock, marca, imagenes) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [nombre, precio, descripcion, categoria, stock, marca, JSON.stringify(imagenes)], (err, result) => {
    if (err) {
      console.error('Error al agregar el producto:', err); // Log detallado
      return res.status(500).json({ error: 'Error al agregar el producto', details: err.message });
    }
    res.status(201).json({ id: result.insertId, nombre, precio, descripcion, categoria, stock, marca, imagenes });
  });
});

// Ruta para actualizar el rol de un usuario
app.put('/api/usuarios/:id/rol', (req, res) => {
  const { id } = req.params;
  const { rol } = req.body; // Asegúrate de que el rol se envíe en el cuerpo de la solicitud
  const sql = 'UPDATE usuarios SET rol = ? WHERE id = ?';
  db.query(sql, [rol, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Rol actualizado correctamente" });
  });
});

// Middleware para verificar JWT en rutas protegidas
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }
  
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido' });
    }
    req.user = decoded;
    next();
  });
};

// Inicia el servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});
