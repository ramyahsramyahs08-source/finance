import api from './api';

export const reportService = {
  getMonthlyReport: async (year, month) => {
    return await api.get('/reports/monthly', { params: { year, month } });
  },
  getYearlyReport: async (year) => {
    return await api.get('/reports/yearly', { params: { year } });
  }
};
