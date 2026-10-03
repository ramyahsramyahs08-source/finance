import api from './api';

export const advisorService = {
  getRecommendations: async () => {
    return await api.get('/advisor/recommendations');
  },
  getHealthScore: async () => {
    return await api.get('/health-score');
  }
};
