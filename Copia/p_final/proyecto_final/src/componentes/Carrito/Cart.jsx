import React from 'react';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const total = cartItems.reduce((sum, item) => 
        sum + (item.precio * item.quantity), 0
    );

    const handleQuantityChange = (id, value) => {
        const newQuantity = Math.max(1, parseInt(value) || 1);
        updateQuantity(id, newQuantity);
    };

    return (
        <div className="cart-container">
            {cartItems.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img 
                                src={item.imagen} 
                                alt={item.nombre}
                                style={{width: '50px'}}
                            />
                            <span>{item.nombre}</span>
                            <span>${item.precio}</span>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            />
                            <button onClick={() => removeFromCart(item.id)}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <div className="cart-total">
                        <strong>Total: ${total.toFixed(2)}</strong>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
