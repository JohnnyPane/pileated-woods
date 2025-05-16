import pileatedClient from "./pileatedClient.js";

export const authService = {
  async login(email, password) {
    try {
      const response = await pileatedClient.post('/users/login', {
        user: { email, password }
      });

      const authToken = response.headers.authorization?.split(' ')[1];

      if (authToken) {
        storeAuthTokenAndUser(authToken, response.data.data);
      } else {
        throw new Error('Authorization token not found');
      }

      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  async signup(email, password, password_confirmation) {
    try {
      const response = await pileatedClient.post('/users/signup', {
        user: { email, password, password_confirmation }
      });

      const authToken = response.headers.authorization?.split(' ')[1];
      if (authToken) {
        storeAuthTokenAndUser(authToken, response.data.data);
      } else {
        throw new Error('Authorization token not found');
      }

      return response.data;
    } catch (error) {
      throw new Error('Signup failed');
    }
  },

  async fetchMe() {
    try {
      const response = await pileatedClient.get('/users/me');
      const authToken = response.headers.authorization?.split(' ')[1];

      if (authToken) {
        storeAuthTokenAndUser(authToken, response.data.data);
      }
      return response.data;
    } catch (error) {
      //   Handle error if needed
    }
  },

  async logout() {
    try {
      await pileatedClient.delete('/users/logout');

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      throw error;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAuthToken() {
    const token = localStorage.getItem('authToken');
    return token ? token : null;
  }
}

const storeAuthTokenAndUser = (token, user) => {
  if (!token || !user) {
    throw new Error('Token or user data is missing');
  }

  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
}