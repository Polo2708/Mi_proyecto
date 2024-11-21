import React, { useState, useEffect } from 'react';
import './ProductTable.css';

const ProductForm = ({ onAddProduct, onUpdateProduct, editing, currentProduct }) => {
  const [product, setProduct] = useState({
    name: '', 
    price: '', 
    descripcion: '', 
    images: [],
    category: '', 
    stock: '',    
    brand: ''
  });

  useEffect(() => {
    if (editing && currentProduct) {
      setProduct({
        name: currentProduct.nombre,
        price: currentProduct.precio,
        descripcion: currentProduct.descripcion,
        images: currentProduct.imagenes || [], 
        category: currentProduct.categoria,
        stock: currentProduct.stock,
        brand: currentProduct.marca
      });
    }
  }, [editing, currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length <= 4) {
      setProduct((prevProduct) => ({ ...prevProduct, images: files }));
    } else {
      alert("Puedes agregar hasta 4 imágenes.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validación de precios y stock
    if (isNaN(product.price) || product.price <= 0) {
      alert('El precio debe ser un número positivo');
      return;
    }
  
    if (isNaN(product.stock) || product.stock < 0) {
      alert('El stock debe ser un número entero no negativo');
      return;
    }
  
    const formData = new FormData();
    formData.append('nombre', product.name);
    formData.append('precio', parseFloat(product.price));
    formData.append('descripcion', product.descripcion);
    product.images.forEach((image) => {
      formData.append('images', image);
    });
    formData.append('categoria', product.category);
    formData.append('stock', parseInt(product.stock));
    formData.append('marca', product.brand);
  
    if (editing) {
      if (typeof onUpdateProduct === 'function') {
        onUpdateProduct(formData);
      } else {
        console.error('onUpdateProduct no es una función');
      }
    } else {
      if (typeof onAddProduct === 'function') {
        console.log('Llamando a onAddProduct', product);
        onAddProduct(formData);
      } else {
        console.error('onAddProduct no es una función');
      }
    }
  
    setProduct({ name: '', price: '', descripcion: '', images: [], category: '', stock: '', brand: '' });
  };
  

  return (
    <div className="form-container">
      <h5>{editing ? 'Actualizar Producto' : 'Añadir Nuevo Producto'}</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={product.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row-input-group">
          <div className="form-group">
            <input
              type="text"
              name="category"
              placeholder="Categoría"
              value={product.category}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="stock"
              placeholder="Cantidad en stock"
              value={product.stock}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="brand"
              placeholder="Marca"
              value={product.brand}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Campo para agregar imágenes */}
        <div className="form-group image-upload">
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <button type="submit">
          {editing ? "Actualizar Producto" : "Añadir Producto"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
