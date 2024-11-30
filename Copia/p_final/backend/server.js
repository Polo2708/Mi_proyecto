const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); // Para encriptar y comparar contraseñas
const jwt = require("jsonwebtoken"); // Para generar tokens JWT
const multer = require("multer"); // Para manejar la carga de archivos
const path = require("path"); // Para manejar rutas de archivos
const { error } = require("console");

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

// Administradores
const adminEmails = [
  'chajisu36@gmail.com',
  'polopolo27@gmail.com'
];

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

// Middleware para verificar el rol del usuario
const verifyRole = (role) => (req, res, next) => {
  if (req.user.rol !== role) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};

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

    // Verificar si el correo pertenece a un administrador
    const rol = adminEmails.includes(email) ? 'admin' : 'cliente';

    // Insertar nuevo usuario en la base de datos
    const queryInsert = "INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)";
    db.query(queryInsert, [nombre, email, hashedPassword, rol], (err) => {
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

    // Asignar el rol de admin si el correo esta en la lista
    const rol = adminEmails.includes(email) ? 'admin' : user.rol;

    // Generar un token JWT
    const token = jwt.sign({
      id: user.id, 
      email: user.email, 
      rol: user.rol
    }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token, user });
  });
});

// Obtener todos los usuarios (solo accesible para admin)
app.get('/api/usuarios', verifyToken, verifyRole('admin'), (req, res) => {
  const sql = 'SELECT id, nombre, email, rol FROM usuarios';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Obtener los detalles de un usuario (solo accesible para admin)
app.get('/api/usuarios/:id', verifyToken, verifyRole('admin'), (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(results[0]);
  });
});

// Eliminar un usuario (solo accesible para admin)
app.delete('/api/usuarios/:id', verifyToken, verifyRole('admin'), (req, res) => {
  const { id } = req.params;
  const sqlCheck = 'SELECT rol FROM usuarios WHERE id = ?';
  db.query(sqlCheck, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (results[0].rol === 'admin') {
      return res.status(403).json({ message: 'No se puede eliminar a un administrador' });
    }

    const sqlDelete = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sqlDelete, [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    });
  });
});

// Actualizar el rol de un usuario (solo accesible para admin)
app.put('/api/usuarios/:id/rol', verifyToken, verifyRole('admin'), (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  if (!rol || (rol !== 'admin' && rol !== 'cliente')) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  const sqlUpdate = 'UPDATE usuarios SET rol = ? WHERE id = ?';
  db.query(sqlUpdate, [rol, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Rol actualizado correctamente' });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
