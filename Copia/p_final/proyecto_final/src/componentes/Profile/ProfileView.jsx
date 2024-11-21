import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const ProfileView = ({ user = {}, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Card.Body className="text-center">
          <div className="mb-3">
            {user.avatar ? (
              <Image src={user.avatar} roundedCircle fluid className="profile-avatar" />
            ) : (
              <FaUserCircle size={120} color="#007bff" className="profile-avatar-placeholder" />
            )}
          </div>

          <h4>{user.name || 'Usuario'}</h4>
          <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
          <p><strong>Rol:</strong> {user.role || 'Usuario'}</p>
          {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
          {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
          {user.dob && <p><strong>Fecha de Nacimiento:</strong> {user.dob}</p>}
          {user.bio && <p><strong>Biografía:</strong> {user.bio}</p>}
          {user.gender && <p><strong>Género:</strong> {user.gender}</p>}

          <Button 
            variant="primary" 
            onClick={() => navigate('/profile/edit')} 
            className="mt-3 w-100"
          >
            Editar Perfil
          </Button>

          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-100 mt-3 logout-button"
          >
            Cerrar sesión
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileView; 