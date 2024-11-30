import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { FaUser, FaShoppingCart, FaCogs } from 'react-icons/fa';
import * as jwt_decode from 'jwt-decode';
import Login from '@/componentes/Login/Login';
import Registro from '@/componentes/Login/Registro';
import Cart from '../Carrito/Cart';  
import Profile from '../Profile/Profile';
import './Navigation.css';
import logo from '../Imagenes/LOGO1.png';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ user, handleLogout, setUser, toggleLogin, toggleCrud, handleUpdateUser }) => {
  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showProfile, setShowProfile] = useState(false);
  const { cartItems, setCartItems } = useCart();  // Asegúrate de que 'setCartItems' esté disponible desde el contexto.
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();  // Usar 'useNavigate' para la redirección

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setRole(decodedToken.rol);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [user]);

  useEffect(() => {
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
    setShowProfile(!showProfile);
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
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, cantidad: 1 }];
    });
  };

  const handleAdminPanel = () => {
    console.log(user);
    if (user && user.role === 'admin') {
      navigate('/admin');  // Redirigir al panel de administración
    } else {
      alert('No tienes permisos para acceder a este panel.');
    }
  };

  return (
    <>
      <Navbar className="navbar-custom">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Fantasy Logo" className="logo-img" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
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

            <div className="d-flex align-items-center ms-auto">
              <button 
                className="btn btn-light ms-3" 
                onClick={handleCartShow}
              >
                <FaShoppingCart />
                {cartItems.length > 0 && (
                  <span className="badge bg-danger ms-2">{cartItems.length}</span>
                )}
              </button>

              {user && (
                <button 
                  className="btn btn-light ms-3" 
                  onClick={handleProductManagement}
                >
                  <FaCogs /> 
                </button>
              )}

              {user ? (
                <Dropdown className="ms-3">
                  <Dropdown.Toggle variant="light" id="dropdown-profile">
                    <FaUser />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleProfileClick}>
                      Ver perfil
                    </Dropdown.Item>
                    {user && user.role === 'admin' && (
                      <Dropdown.Item onClick={handleAdminPanel}>
                        Administrar Clientes
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={handleLogout}>
                      Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <button className="btn btn-light ms-3" onClick={handleShow}>
                  <FaUser /> Iniciar sesión
                </button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

      <Modal 
        show={showCartModal} 
        onHide={handleCartShow} 
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
          <Button variant="secondary" onClick={handleCartShow}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {showProfile && user && (
        <Modal show={showProfile} onHide={handleProfileClick} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Perfil de {user.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Profile 
              user={user} 
              handleLogout={handleLogout} 
              handleClose={handleProfileClick} 
              handleUpdateUser={handleUpdateUser} 
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Navigation;
