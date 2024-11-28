import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch usuarios al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/usuarios');
        setUsuarios(response.data);  // Guardar los usuarios obtenidos
      } catch (error) {
        setError('Error al obtener los usuarios');
      } finally {
        setLoading(false);  // Termina la carga
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Usuarios Registrados</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id}>
              <td>{index + 1}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <Button variant="info" className="mr-2">Ver</Button>
                <Button variant="warning" className="mr-2">Editar</Button>
                <Button variant="danger">Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Usuarios;
