import axios from 'axios';

const apiUrl = 'http://localhost:4000/api/products/';

export const fetchProducts = () => axios.get(apiUrl).then(res => res.data);
export const addProduct = (product) => axios.post(`${apiUrl}addProduct`, product).then(res => res.data);
export const updateProduct = (id, product) => axios.put(`${apiUrl}/${id}`, product).then(res => res.data);
export const deleteProduct = (id) => axios.delete(`${apiUrl}/${id}`).then(res => res.data);
