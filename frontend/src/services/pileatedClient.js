import axios from 'axios';
import { authService } from "./auth.js";
import qs from 'qs';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

const serializeParams = (params) => {
  return qs.stringify(params, { arrayFormat: 'brackets' });
};

const deserializeParams = (queryString) => {
  return qs.parse(queryString, { ignoreQueryPrefix: true, arrayFormat: 'brackets' });
}

const pileatedClient = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: serializeParams,
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

export {
  serializeParams,
  deserializeParams,
}

export default pileatedClient;