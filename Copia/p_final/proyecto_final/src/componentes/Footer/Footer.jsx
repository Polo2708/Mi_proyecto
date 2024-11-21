import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>Fantasy</h2>
        <nav>
          <ul>
            <li><a href="/about">Sobre nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/privacy">Política de privacidad</a></li>
          </ul>
        </nav>
        <p>© 2024 Fantasy. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
