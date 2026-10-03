import api from './api';

export const transactionService = {
  getTransactions: async (params = {}) => {
    return await api.get('/transactions', { params });
  },
  createTransaction: async (data) => {
    return await api.post('/transactions', data);
  },
  updateTransaction: async (id, data) => {
    return await api.put(`/transactions/${id}`, data);
  },
  deleteTransaction: async (id) => {
    return await api.delete(`/transactions/${id}`);
  },
  getCategories: async () => {
    return await api.get('/transactions/categories');
  }
};
