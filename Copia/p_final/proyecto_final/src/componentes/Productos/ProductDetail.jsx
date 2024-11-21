import React from 'react';

const ProductDetail = ({ product, onClearSelection }) => {
  return (
    <div className="product-detail">
      <h3>Detalles del Producto</h3>
      <button onClick={onClearSelection}>Volver a la lista</button>

      <div>
        <h4>{product.nombre}</h4>
        <p><strong>Descripción:</strong> {product.descripcion}</p>
        <p><strong>Precio:</strong> ${product.precio}</p>
        <p><strong>Stock disponible:</strong> {product.stock}</p>
        <p><strong>Categoría:</strong> {product.categoria}</p>
        <p><strong>Marca:</strong> {product.marca}</p>
        
        {/* Mostrar las imágenes del producto */}
        <div className="product-images">
          {product.imagenes.map((image, index) => (
            <img key={index} src={image} alt={`Imagen ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
