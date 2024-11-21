import axios from 'axios';

const API_URL = 'http://localhost:3001/api/productos';

export const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('Productos obtenidos:', response.data); //Verifica que los datos llegan 
        return response.data;
    }catch(error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const addProduct = async (formData) => {
    const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProduct = async (id, updatedProduct) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
    return response.data;
};

export const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
