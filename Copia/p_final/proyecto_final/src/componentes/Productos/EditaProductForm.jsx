import React, { useState, useEffect } from 'react';
import { useProduct } from '../../context/ProductContext';
import { Button, Form } from 'react-bootstrap';

const EditProductForm = ({ product, onClose }) => {
    const { updateProduct } = useProduct(); // Obtener la función de actualización desde el contexto
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });

    // Manejar el cambio de los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({
            ...updatedProduct,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProduct(updatedProduct); // Llamar a la función de actualización
        onClose(); // Cerrar el formulario de edición
    };

    return (
        <div className="profile-container">
            <h2>Editar Producto</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={updatedProduct.nombre}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        name="precio"
                        value={updatedProduct.precio}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        name="stock"
                        value={updatedProduct.stock}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control
                        type="text"
                        name="imagenes"
                        value={updatedProduct.imagenes}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Guardar cambios
                </Button>
                <Button variant="secondary" onClick={onClose} className="ml-2">
                    Cancelar
                </Button>
            </Form>
        </div>
    );
};

export default EditProductForm;
