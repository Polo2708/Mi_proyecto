import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import EditProductForm from './EditaProductForm';

const ProductRow = ({ product }) => {
  const { removeProduct } = useProduct();
  const [isEditing, setIsEditing] = useState(false); //Estado para el formulario de

  const handleRemove = () => {
    removeProduct(product.id); // Eliminar el producto
  };

  let parsedImages = [];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEditForm = () => {
    setIsEditing(false); //Cerrar el formulario de edicion
  }

  try {
    parsedImages = JSON.parse(product.imagenes);
  } catch (error) {
    console.error("Error al parsear las imágenes:", error);
    parsedImages = []; // Si hay un error, la imagen queda como un array vacío
  }

  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.nombre}</td>
      <td>${product.precio}</td>
      <td>{product.stock}</td>
      <td>
        {parsedImages.length > 0 && (
          <img
            src={`http://localhost:3001/uploads/${parsedImages[0]}`}
            alt={product.nombre}
            style={{ width: '50px' }}
          />
        )}
      </td>
      <td>
        <button onClick={handleRemove}>Eliminar</button>
        <button onClick={handleEdit}>Editar</button>
      </td>
      {isEditing && (
        <td colSpan={6}>
            <EditProductForm product={product} onClose={handleCloseEditForm}/>
        </td>
      )}
    </tr>
  );
};

export default ProductRow;
