import { useParams } from "react-router-dom";

const products = [
  { id: 1, name: "Camiseta Selección Colombia", price: 349900, stock: 25, description: "Camiseta oficial de la selección Colombia." },
  { id: 2, name: "Zapatos Nike Air", price: 499900, stock: 10, description: "Zapatos deportivos Nike Air de última generación." },
];

function ProductDetails() {
  const { id } = useParams(); // Captura el ID del producto desde la URL
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <h2>Producto no encontrado</h2>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Precio: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Descripción: {product.description}</p>
      <button>Añadir al carrito</button>
    </div>
  );
}

export default ProductDetails;
