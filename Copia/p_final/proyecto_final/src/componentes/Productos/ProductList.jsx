import React from 'react';
import { useProduct } from '../../context/ProductContext';
import ProductRow from './ProductRow';

const ProductList = () => {
  const { products } = useProduct(); // Acceder a los productos desde el contexto

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow 
              key={product.id} 
              product={product} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
    