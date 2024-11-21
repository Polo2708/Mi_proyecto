import React, { useState } from 'react';
import { Login } from '../Login/Login';
import { Registro } from '../Login/Registro';
import './Auth.css';

const Auth = ({ setUser, closeModal }) => {
  const [showRegister, setShowRegister] = useState(false);

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  console.log("Auth Component Rendered"); // Mensaje de depuración

  return (
    <div className="auth-modal">
      {showRegister ? (
        <Registro setUser={setUser} closeModal={closeModal} />
      ) : (
        <Login setUser={setUser} toggleRegister={toggleRegister} closeModal={closeModal} />
      )}
    </div>
  );
};


export default Auth;
