import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginAPI = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getVehiclesAPI = async () => {
  const response = await api.get('/vehicles');
  return response.data;
};

export const purchaseVehicle = async (id) => {
  const response = await api.post(`/vehicles/${id}/purchase`);
  return response.data;
};

export const getMyPurchases = async () => {
  const response = await api.get('/purchases/my-history');
  return response.data;
};

export default api;
