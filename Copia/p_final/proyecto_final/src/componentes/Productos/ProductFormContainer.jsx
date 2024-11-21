import React from 'react';
import ProductForm from './ProductForm';

const ProductFormContainer = ({ onAddProduct, onUpdateProduct, editing, currentProduct }) => {
    return (
        <ProductForm
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            editing={editing}
            currentProduct={currentProduct}
        />
    );
};

export default ProductFormContainer;
