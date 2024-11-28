import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';  // Asegúrate de que esta ruta sea correcta
import { formatPrice } from '../../utils/formatPrice';  // Función separada para formatear el precio
import Invoice from '../Invoice/Invoice.jsx';  // Nuevo componente para la factura
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth() || {};  // Accedemos a los datos del usuario logueado desde el contexto

    if (!user) {
        return <div>Por favor, inicie sesión para realizar una compra.</div>;  // Si no hay usuario logueado
    }

    // Calcular el total del carrito
    const total = cartItems.reduce((sum, item) =>
        sum + (item.precio * item.quantity), 0
    );

    // Función para manejar cambios en la cantidad
    const handleQuantityChange = (id, value) => {
        const newQuantity = Math.max(1, parseInt(value) || 1);
        updateQuantity(id, newQuantity);
    };

    return (
        <div className="cart-container">
            {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                    <p>El carrito está vacío</p>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => {
                            let parsedImages = [];
                            try {
                                parsedImages = JSON.parse(item.imagenes);
                            } catch (error) {
                                parsedImages = [];
                            }

                            return (
                                <div key={item.id} className="cart-item">
                                    <div className="remove-item-x" onClick={() => removeFromCart(item.id)}>
                                        &times;
                                    </div>
                                    <div className="cart-item-image-container">
                                        {parsedImages.length > 0 && (
                                            <img
                                                src={`http://localhost:3001/uploads/${parsedImages[0]}`}
                                                alt={item.nombre}
                                                className="cart-item-image"
                                            />
                                        )}
                                    </div>
                                    <div className="cart-item-info">
                                        <span className="item-name">{item.nombre}</span>
                                        <div className="item-divider"></div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            className="quantity-input"
                                        />
                                    </div>
                                    <span className="item-price">{formatPrice(item.precio * item.quantity)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cart-total">
                        <strong>Total: {formatPrice(total)}</strong>
                    </div>
                    <div className="cart-actions">
                        <Invoice cartItems={cartItems} total={total} user={user} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
