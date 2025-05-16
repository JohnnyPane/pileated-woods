import axios from 'axios';
import { authService } from "./auth.js";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

const pileatedClient = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

pileatedClient.interceptors.request.use(
  (config) => {
    const token = authService.getAuthToken();
    const guestToken = localStorage.getItem('guestToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (guestToken) {
      config.headers['X-Guest-Token'] = guestToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default pileatedClient;