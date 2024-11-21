import React from 'react';
import { useCart } from '../../context/CartContext';

const ProductRow = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <tr>
            <td>{product.id}</td>
            <td>{product.nombre}</td>
            <td>${product.precio}</td>
            <td>{product.stock}</td>
            <td>
                <img 
                    src={`http://localhost:3001/uploads/${JSON.parse(product.imagenes)[0]}`} 
                    alt={product.nombre} 
                    style={{width: '50px'}}
                />
            </td>
            <td>
                <button onClick={() => addToCart(product)}>
                    Agregar al carrito
                </button>
            </td>
        </tr>
    );
};

export default ProductRow;
