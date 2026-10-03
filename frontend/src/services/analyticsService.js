import api from './api';

export const analyticsService = {
  getAnalytics: async (filter = '6_months', startDate = null, endDate = null) => {
    const params = { filter };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return await api.get('/analytics', { params });
  },
  getCategoryBreakdown: async (filter = 'this_month') => {
    return await api.get('/analytics/category', { params: { filter } });
  },
  getMonthlyTrend: async () => {
    return await api.get('/analytics/monthly');
  }
};
