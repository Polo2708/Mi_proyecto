import React, { useState } from 'react';
import { Button, Card, Image, Form } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const ProfileEdit = ({ user = {}, handleUpdateUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateUser(userData);
    navigate('/profile'); // Volver a la vista de perfil
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

          <Form onSubmit={handleSubmit}>
            {/* Los mismos campos del formulario que tenías antes */}
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </Form.Group>
            {/* ... resto de los campos del formulario ... */}

            <div className="mt-3">
              <Button type="submit" variant="primary" className="w-100">
                Guardar Cambios
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/profile')} 
                className="w-100 mt-2"
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileEdit; 