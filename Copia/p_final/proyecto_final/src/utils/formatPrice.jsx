export const formatPrice = (price) => {
    return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
};
