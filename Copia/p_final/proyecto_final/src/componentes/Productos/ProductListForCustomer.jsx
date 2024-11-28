import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import './ProductListForCustomer.css';

const ProductListForCustomer = ({ products }) => {
    const { addToCart } = useCart();

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Nuestros Productos</h2>
            <Row className="product-grid justify-content-center">
                {products.map(product => (
                    <Col key={product.id} xs={6} sm={6} md={4} lg={3} className="mb-3">
                        <Card className="product-card h-100 shadow-sm">
                            <div className="product-image-container">
                                <Card.Img
                                    variant="top"
                                    src={`http://localhost:3001/uploads/${JSON.parse(product.imagenes)[0]}`}
                                    alt={product.nombre}
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            <Card.Body className="product-card-body d-flex flex-column">
                                <Card.Title className="product-title h5 mb-3">{product.nombre}</Card.Title>
                                <Card.Text className="product-price mb-0 h4">
                                    ${Number(product.precio).toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </Card.Text>
                                <Button 
                                    variant="primary"
                                    className="add-to-cart-btn mt-2"
                                    onClick={() => addToCart(product)}
                                    title="Añadir al carrito"
                                >
                                    <i className="fas fa-shopping-cart"></i> Añadir al carrito
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductListForCustomer;
