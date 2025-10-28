import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
