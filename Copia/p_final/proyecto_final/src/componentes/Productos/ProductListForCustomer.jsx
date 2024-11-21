import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import './ProductListForCustomer.css';

const ProductListForCustomer = ({ products }) => {
    const { addToCart } = useCart();

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Catálogo</h2>
            <Row className="product-grid">
                {products.map(product => (
                    <Col key={product.id} className="col-2-4 mb-3">
                        <Card className="product-card">
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
                            <Card.Body className="product-card-body">
                                <Card.Title className="product-title">{product.nombre}</Card.Title>
                                <Card.Text className="product-price">
                                    ${Number(product.precio).toFixed(2)}
                                </Card.Text>
                                <Button 
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)}
                                >
                                    +
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
