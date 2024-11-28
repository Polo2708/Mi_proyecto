import React from 'react';
import { jsPDF } from 'jspdf';
import { formatPrice } from '../../utils/formatPrice'; 
import './Invoice.css';
import logo from '../Imagenes/LOGO1.png'; 

const Invoice = ({ cartItems, total, user }) => {
    // Función para generar el PDF de la factura
    const generateInvoice = () => {
        const doc = new jsPDF();

        // Configuración general del documento
        doc.setFont("helvetica", "normal");

        // Agregar logo 
        doc.addImage(logo, 'PNG', 20, 10, 30, 30);

        // Nombre de la tienda
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Tiendas Fantasy S.A.S.", 70, 25);

        // Título de la factura
        doc.setFontSize(18);
        doc.text("Factura de Compra", 105, 40, null, null, 'center');

        // Información del cliente 
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Cliente: ${user.nombre}`, 20, 60);
        doc.text(`Email: ${user.email}`, 20, 70);
        doc.text(`Teléfono: ${user.telefono}`, 20, 80);
        doc.text(`Dirección: ${user.direccion}`, 20, 90);

        // Línea divisoria entre datos del cliente y productos
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.line(20, 100, 190, 100);

        // Título de productos
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Productos:", 20, 110);

        // Tabla con los productos
        const startY = 120;
        let yPosition = startY;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        // Encabezado de la tabla
        doc.setFont("helvetica", "bold");
        doc.text("Producto", 20, yPosition);
        doc.text("Cantidad", 100, yPosition, null, null, 'center');
        doc.text("Precio", 150, yPosition, null, null, 'right');

        yPosition += 10;

        //Filas de productos
        cartItems.forEach((item) => {
            doc.setFont("helvetica", "normal");
            doc.text(item.nombre, 20, yPosition);
            doc.text(item.quantity.toString(), 100, yPosition, null, null, 'center');
            doc.text(formatPrice(item.precio * item.quantity), 150, yPosition, null, null, 'right');
            yPosition += 10;
        });

        // Línea divisoria entre productos y total
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);  // Línea horizontal
        yPosition += 5;

        // Total
        doc.setFont("helvetica", "bold");
        doc.text(`Total: ${formatPrice(total)}`, 20, yPosition);

        // Pie de página
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.text("Gracias por su compra. Visítenos nuevamente!", 105, 270, null, null, 'center');
        
        // Descargar el PDF
        doc.save("factura-compra.pdf");
    };

    return (
        <button onClick={generateInvoice} className="purchase-button">
            Comprar
        </button>
    );
};

export default Invoice;
