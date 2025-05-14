import axios from 'axios';

import { AuthService } from "./auth.js";

const pileatedApi = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

pileatedApi.interceptors.request.use(
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

export default pileatedApi;