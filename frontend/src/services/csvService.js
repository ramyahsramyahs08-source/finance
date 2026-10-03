import api from './api';

export const csvService = {
  uploadCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  importTransactions: async (importPayload) => {
    return await api.post('/csv/import', importPayload);
  },
  getHistory: async () => {
    return await api.get('/csv/history');
  }
};
