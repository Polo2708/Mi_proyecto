import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import Navigation from './componentes/Navegacion/Navigation';
import Inicio from './componentes/Inicio/Inicio';
import ErrorBoundary from './componentes/Error/ErrorBoundary';
import Footer from './componentes/Footer/Footer';
import Productos from './componentes/Productos/Productos';
import { fetchProducts } from './componentes/Productos/api';
import ProductListForCustomer from './componentes/Productos/ProductListForCustomer';
import Login from './componentes/Login/Login'; 
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCrud, setShowCrud] = useState(false); 
  const [products, setProducts] = useState([]);

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data); 
    };

    loadProducts();
  }, []);

  // Cargar el usuario almacenado en el localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Alternar el estado del modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Alternar el formulario de login
  const toggleLoginForm = () => setShowLogin(!showLogin);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <ErrorBoundary>
            <div className="App">
              <Navigation 
                user={user} 
                handleLogout={handleLogout} 
                setUser={setUser} 
                toggleLogin={toggleLoginForm} 
                toggleCrud={() => setShowCrud(!showCrud)} 
                />
              
              {/* Si el usuario no está autenticado, muestra la pantalla de inicio */}
              {!user ? <Inicio user={user} /> : <p>Hola, {user.email}!</p>}
              
              {/* Modal para mostrar la lista de productos y el CRUD */}
              <Modal show={showCrud} onHide={() => setShowCrud(false)} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Gestionar Productos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Productos />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowCrud(false)}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Muestra la lista de productos para el cliente en la vista principal */}
              <ProductListForCustomer products={products} />

              {/* Mostrar formulario de login si showLogin es verdadero */}
              {showLogin && <Login setUser={setUser} />}          
              
              <Footer />
            </div>
          </ErrorBoundary>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
