import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { FaUser, FaShoppingCart, FaCogs } from 'react-icons/fa';  // Iconos
import Login from '@/componentes/Login/Login';
import Registro from '@/componentes/Login/Registro';
import Cart from '../Carrito/Cart';  
import Profile from '../Profile/Profile';
import './Navigation.css';
import logo from '../Imagenes/LOGO1.png';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const Navigation = ({ user, handleLogout, setUser, toggleLogin, toggleCrud, handleUpdateUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showProfile, setShowProfile] = useState(false);  // Estado para mostrar el perfil
  const { cartItems } = useCart();
  const [filteredItems, setFilteredItems] = useState([]); // Estado para los productos filtrados

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    // Filtrar los productos según la consulta de búsqueda
    const results = cartItems.filter(item => 
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchQuery, cartItems]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const toggleForm = () => setIsLogin(!isLogin);

  const handleCartShow = () => {
    setShowCartModal(!showCartModal);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductManagement = () => {
    toggleCrud();
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);  // Alternar el estado para mostrar el perfil
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? {...item, cantidad: newQuantity}
          : item
      )
    );
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? {...item, cantidad: item.cantidad + 1}
            : item
        );
      }
      
      // Si es un nuevo producto, agregarlo al carrito
      return [...prevItems, {...product, cantidad: 1}];
    });
  };

  return (
    <>
      {/* Barra de navegación */}
      <Navbar className="navbar-custom">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Fantasy Logo" className="logo-img" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

              {/* Dropdown de productos con categorías */}
              <Nav.Item className="dropdown">
                <Nav.Link href="/productos" className="dropdown-toggle" data-bs-toggle="dropdown">
                  Marcas
                </Nav.Link>
                <ul className="dropdown-menu">
                  <li><Nav.Link href="/productos/nike">Nike</Nav.Link></li>
                  <li><Nav.Link href="/productos/adidas">Adidas</Nav.Link></li>
                  <li><Nav.Link href="/productos/reebok">Reebok</Nav.Link></li>
                  <li><Nav.Link href="/productos/otros">Skechers</Nav.Link></li>
                </ul>
              </Nav.Item>

              {/* Secciones de Hombres, Mujer, Niños */}
              <Nav.Link href="/hombres">Hombres</Nav.Link>
              <Nav.Link href="/mujer">Mujer</Nav.Link>
              <Nav.Link href="/ninos">Niños</Nav.Link>
            </Nav>

            <Form className="d-flex search-form me-auto">
              <Form.Control
                type="search"
                placeholder="Busca en Fantasy"
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </Form>

            {/* Espacio para separar la barra de búsqueda y el botón de inicio de sesión */}
            <div className="d-flex align-items-center ms-auto">
              {/* Carrito de compras */}
              <button 
                className="btn btn-light ms-3" 
                onClick={() => setShowCartModal(true)}
              >
                <FaShoppingCart />
                {cartItems.length > 0 && (
                  <span className="badge bg-danger ms-2">{cartItems.length}</span>
                )}
              </button>

              {/* Botón de gestión de productos (solo visible si el usuario está logueado) */}
              {user && (
                <button 
                  className="btn btn-light ms-3" 
                  onClick={handleProductManagement}
                >
                  <FaCogs /> 
                </button>
              )}
              
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/Usuarios">Usuarios</Nav.Link>

              {/* Si el usuario está logueado, mostrar el dropdown de perfil */}
              {user ? (
                <Dropdown className="ms-3">
                  <Dropdown.Toggle variant="light" id="dropdown-profile">
                    <FaUser />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleProfileClick}>
                      Ver perfil
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                // Botón de Iniciar sesión si no está logueado
                <button className="btn btn-light ms-3" onClick={handleShow}>
                  <FaUser /> Iniciar sesión
                </button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de Login */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLogin ? (
            <Login setUser={setUser} toggleLogin={toggleForm} />
          ) : (
            <Registro setUser={setUser} toggleLogin={toggleForm} />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal del carrito de compras */}
      <Modal 
        show={showCartModal} 
        onHide={() => setShowCartModal(false)} 
        size="lg"
        aria-labelledby="cart-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="cart-modal">Carrito de Compras</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cart 
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Perfil */}
      {showProfile && user && (
        <Modal show={showProfile} onHide={handleProfileClick} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Perfil de {user.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Profile user={user} handleLogout={handleLogout} handleClose={handleProfileClick} handleUpdateUser={handleUpdateUser} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Navigation;
