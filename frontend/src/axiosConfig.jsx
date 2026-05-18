import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

axiosInstance.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('user');

  if (savedUser) {
    const user = JSON.parse(savedUser);

    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

export default axiosInstance;