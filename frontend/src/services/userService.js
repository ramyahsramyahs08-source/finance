import api from './api';

export const userService = {
  getProfile: async () => {
    return await api.get('/user/profile');
  },
  updateProfile: async (data) => {
    return await api.put('/user/profile', data);
  },
  updatePassword: async (data) => {
    return await api.put('/user/password', data);
  },
  seedDemoData: async () => {
    return await api.post('/user/seed-demo-data');
  },
  resetData: async () => {
    return await api.post('/user/reset-data');
  }
};
