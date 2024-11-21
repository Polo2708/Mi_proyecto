import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ProductFormContainer from './ProductFormContainer';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from './api';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = async (formData) => {
        try {
            const newProduct = await addProduct(formData);
            setProducts((prev) => [...prev, newProduct]);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await updateProduct(updatedProduct.id, updatedProduct);
            setProducts((prev) => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating product', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const editRow = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
    };

    return (
        <div className="product-table">
            <h2>Gestión de Productos</h2>
            <ProductFormContainer
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                editing={isEditing}
                currentProduct={currentProduct}
            />
            <h3>Lista de Productos</h3>
            <ProductList products={products} onEdit={editRow} onDelete={handleDeleteProduct} />
        </div>
    );
};

export default ProductTable;
