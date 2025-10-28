import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => authToken;

export const login = async (username, password) => {
  try {
    const response = await api.post(
      `/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    );
    const token = response.data.access_token;
    setAuthToken(token);
    return token;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Login failed'
    );
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
    });
    const token = response.data.access_token;
    setAuthToken(token);
    return token;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Registration failed'
    );
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch user'
    );
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const fetchTickets = async () => {
  try {
    const response = await api.get('/api/tickets/');
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch tickets'
    );
  }
};

export const fetchTicket = async (id) => {
  try {
    const response = await api.get(`/api/tickets/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch ticket'
    );
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/api/tickets/', ticketData);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to create ticket'
    );
  }
};

export const updateTicket = async (id, updates) => {
  try {
    const response = await api.patch(`/api/tickets/${id}`, updates);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to update ticket'
    );
  }
};

export const deleteTicket = async (id) => {
  try {
    await api.delete(`/api/tickets/${id}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to delete ticket'
    );
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users/');
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch users'
    );
  }
};
