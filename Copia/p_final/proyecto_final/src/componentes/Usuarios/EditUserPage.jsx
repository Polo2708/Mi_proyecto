import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditUserPage = () => {
  const { email } = useParams();  // Obtener el email del usuario desde la URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer', // Rol por defecto
  });

  useEffect(() => {
    // Buscar el usuario en localStorage usando el email
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userToEdit = storedUsers.find((user) => user.email === email);

    if (userToEdit) {
      setFormData(userToEdit); // Llenar el formulario con los datos del usuario
    } else {
      navigate('/admin');  // Si el usuario no se encuentra, redirigir al panel de administración
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = storedUsers.map((user) =>
      user.email === formData.email ? { ...user, ...formData } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Actualizar localStorage
    navigate('/admin'); // Redirigir de vuelta al panel de administración
  };

  return (
    <div>
      <h2>Editar Usuario</h2>
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

        <Button variant="primary" onClick={handleSaveUser}>
          Guardar Cambios
        </Button>
      </Form>
    </div>
  );
};

export default EditUserPage;
