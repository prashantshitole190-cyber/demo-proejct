import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (email, password) => api.post('/auth/login/', { email, password }),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/users/profile/'),
  forgotPassword: (email) => api.post('/users/forgot-password/', { email }),
  resetPassword: (token, password) => api.post(`/users/reset-password/${token}/`, { password }),
};

export const articlesAPI = {
  getAll: () => api.get('/articles/'),
  getBySlug: (slug) => api.get(`/articles/${slug}/`),
  create: (articleData) => api.post('/articles/', articleData),
  update: (slug, articleData) => api.put(`/articles/${slug}/`, articleData),
  delete: (slug) => api.delete(`/articles/${slug}/`),
  publish: (slug) => api.post(`/articles/${slug}/publish/`),
};

export const usersAPI = {
  getByEmail: (email) => api.get(`/users/${email}/`),
  getUserArticles: (email) => api.get(`/users/${email}/articles/`),
};

export const interactionsAPI = {
  clap: (slug) => api.post(`/interactions/clap/${slug}/`),
  bookmark: (slug) => api.post(`/interactions/bookmark/${slug}/`),
  removeBookmark: (slug) => api.delete(`/interactions/bookmark/${slug}/`),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications/'),
  markAsRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllAsRead: () => api.post('/notifications/mark-all-read/'),
};

export default api;