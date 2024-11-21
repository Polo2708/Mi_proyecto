import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image, Form } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';  // Para un ícono de usuario si no hay imagen
import './Profile.css';  // Importamos los estilos CSS

const Profile = ({ user = {}, handleLogout, handleUpdateUser }) => {
  const defaultUser = {
    name: 'Usuario',
    email: 'No disponible',
    role: 'Usuario',
    phone: '',
    address: '',
    dob: '',
    bio: '',
    gender: ''
  };

  const [userData, setUserData] = useState({ ...defaultUser, ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSaveChanges = () => {
    handleUpdateUser(userData);
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Card.Body className="text-center">
          <div className="mb-3">
            {userData.avatar ? (
              <Image src={userData.avatar} roundedCircle fluid className="profile-avatar" />
            ) : (
              <FaUserCircle size={120} color="#007bff" className="profile-avatar-placeholder" />
            )}
          </div>

          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Biografía</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={userData.bio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Género</Form.Label>
              <Form.Control
                type="text"
                name="gender"
                value={userData.gender}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveChanges} className="mt-3">
              Guardar cambios
            </Button>
          </Form>

          <Button
            variant="danger"
            size="lg"
            onClick={handleLogout}
            className="w-100 mt-3 logout-button"
            aria-label="Cerrar sesión"
          >
            Cerrar sesión
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    dob: PropTypes.string,
    bio: PropTypes.string,
    gender: PropTypes.string
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleUpdateUser: PropTypes.func.isRequired
};

export default Profile;
