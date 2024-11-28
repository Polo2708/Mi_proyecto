import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

// Hook para acceder al contexto de productos
export const useProduct = () => {
    return useContext(ProductContext);
};

// Proveedor del contexto de productos
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]); // El estado de los productos

    // Función para cargar productos desde la API
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/productos');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            alert('Hubo un error al cargar los productos');
        }
    };

    // Función para eliminar un producto
    const removeProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/productos/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));

            alert('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un error al eliminar el producto');
        }
    };

    // Función para actualizar un producto
    const updateProduct = async (updatedProduct) => {
        try {
            const response = await fetch(`http://localhost:3001/api/productos/${updatedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            // Actualizamos el estado de los productos en el frontend
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );

            alert('Producto actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Hubo un error al actualizar el producto');
        }
    };

    // Cargar los productos al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts, removeProduct, updateProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
