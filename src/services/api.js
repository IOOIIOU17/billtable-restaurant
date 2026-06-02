import axios from 'axios';

const api = axios.create({
  baseURL: 'https://billtable-backend.onrender.com',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurantToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
