import axios from 'axios';

const api = axios.create({
  baseURL: 'https://heavyhire.onrender.com/api', // Update if deployed
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
