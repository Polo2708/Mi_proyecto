import React, { useState } from 'react';
import './Formulario.css';

const Registro = ({ setUser, toggleLogin }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Llamada al backend para registrar el usuario
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, contraseña }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ email }); // Guardar el email si el registro fue exitoso
        setError(''); // Limpiar el mensaje de error
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <form onSubmit={handleRegister} className="form-container">
      <div className="form-group">
        <label>Nombre de usuario</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa tu nombre de usuario"
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu email"
          required
        />
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>
      <button type="submit">Registrar</button><br/>
      <button type="button" onClick={toggleLogin} style={{ marginLeft: '10px' }}>
        ¿Ya tienes cuenta? Inicia Sesión
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Registro;
