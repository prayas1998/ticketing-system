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
    try {
      localStorage.setItem('authToken', token);
    } catch (error) {
      // Silently handle localStorage errors
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      // Silently handle localStorage errors
    }
  }
};

const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      authToken = token;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    // Silently handle localStorage errors
  }
};

loadTokenFromStorage();

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

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
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      const cleanedDetail = cleanErrorMessage(typeof detail === 'string' ? detail : 'Invalid credentials');
      throw new Error(cleanedDetail || 'Invalid username or password. Please try again.');
    }
    throw new Error('Unable to sign in. Please check your connection and try again.');
  }
};

const cleanErrorMessage = (message) => {
  return message
    .replace(/Value error,?\s*/gi, '')
    .replace(/^,\s*/, '')
    .trim();
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
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        const messages = detail
          .map(err => cleanErrorMessage(err.msg || err.message || ''))
          .filter(msg => msg)
          .join('. ');
        throw new Error(messages || 'Registration failed. Please check your information.');
      }
      const cleanedDetail = cleanErrorMessage(typeof detail === 'string' ? detail : '');
      throw new Error(cleanedDetail || 'Registration failed. Please try again.');
    }
    throw new Error('Unable to register. Please check your connection and try again.');
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
