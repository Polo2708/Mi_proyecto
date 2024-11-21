import React, { useState } from 'react';
import './Formulario.css';

const Login = ({ setUser, toggleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = { email, contraseña: password };

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ email }));
        setUser({ email });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Eliminar el usuario y el token del localStorage
    localStorage.removeItem("user");
    setUser(null); // Limpia el estado del usuario
    // Redirigir a la página de login o inicio
    window.location.href = "/login"; 
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        <button type="button" onClick={toggleLogin}>
          ¿No tienes cuenta? Regístrate
        </button>
      </form>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Login;
