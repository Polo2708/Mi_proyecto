import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';  // No necesitas envolver en Router aquí
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* Directamente renderizamos el componente App */}
  </StrictMode>
);
