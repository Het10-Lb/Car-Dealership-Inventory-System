import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
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

export const searchVehiclesAPI = async (queryParams) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const response = await api.get(`/vehicles/search?${queryString}`);
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

// Admin endpoints
export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

export const restockVehicle = async (id, quantity) => {
  const response = await api.post(`/vehicles/${id}/restock`, { quantity });
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Settings endpoints
export const updateProfileAPI = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const updatePasswordAPI = async (data) => {
  const response = await api.put('/auth/password', data);
  return response.data;
};

// Ticket endpoints
export const createTicketAPI = async (data) => {
  const response = await api.post('/tickets', data);
  return response.data;
};

export const getMyTicketsAPI = async () => {
  const response = await api.get('/tickets/my-tickets');
  return response.data;
};

export const getAllTicketsAPI = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const resolveTicketAPI = async (id, adminResponse) => {
  const response = await api.put(`/tickets/${id}/resolve`, { adminResponse });
  return response.data;
};

export default api;
