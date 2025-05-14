import axios from 'axios';
import { AuthService } from "./auth.js";

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
    const token = AuthService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default pileatedClient;