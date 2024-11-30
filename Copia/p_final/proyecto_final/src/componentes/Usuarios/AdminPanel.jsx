import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);         // Lista de usuarios
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [currentUser, setCurrentUser] = useState(null); // Usuario que se va a editar
  const [formData, setFormData] = useState({       // Datos del formulario de edición
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer', // Rol por defecto
  });

  const navigate = useNavigate(); // Usando navigate para redirigir

  // Verificar si el usuario tiene rol 'admin' al cargar el componente
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser || loggedUser.role !== 'admin') {
      // Si el usuario no es admin, redirigirlo a la página de login
      navigate('/login');
    }

    // Obtener los usuarios desde el backend
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${loggedUser.token}`, // Usando token JWT para autorización
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Usuarios obtenidos:', data);
          setUsers(data);
        } else {
          console.error('Error al obtener usuarios');
        }
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Manejo del formulario de edición
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Mostrar el modal de edición de usuario
  const handleEditUser = (user) => {
    setCurrentUser(user);   // Guardar el usuario que se va a editar
    setFormData(user);      // Llenar el formulario con los datos del usuario
    setShowModal(true);     // Mostrar el modal
  };

  // Guardar los cambios de usuario
  const handleSaveUser = async () => {
    const updatedUsers = users.map((user) =>
      user.email === currentUser.email ? { ...user, ...formData } : user
    );
    // Guardar los usuarios actualizados en el backend
    const response = await fetch(`http://localhost:3001/api/usuarios/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('user').token}`,
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      setUsers(updatedUsers);  // Actualizar el estado con los usuarios nuevos
      setShowModal(false);     // Cerrar el modal
    } else {
      console.error('Error al guardar los cambios');
    }
  };

  // Eliminar un usuario
  const handleDeleteUser = async (id) => {
    const response = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('user').token}`,
      },
    });

    if (response.ok) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers); // Actualizar el estado con la lista de usuarios nueva
    } else {
      console.error('Error al eliminar el usuario');
    }
  };

  return (
    <div>
      <h2>Panel de Administración de Clientes</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{user.telefono}</td>
              <td>{user.direccion}</td>
              <td>{user.rol}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(user)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Cliente</option>
                <option value="admin">Administrador</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
