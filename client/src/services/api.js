import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'API Error occurred';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    demoLogin: (role) => apiClient.post('/auth/demo-login', { role }),
    me: () => apiClient.get('/auth/me'),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email })
  },
  projects: {
    getAll: (params) => apiClient.get('/projects', { params }),
    create: (data) => apiClient.post('/projects', data),
    update: (id, data) => apiClient.put(`/projects/${id}`, data),
    delete: (id) => apiClient.delete(`/projects/${id}`)
  },
  workspaces: {
    getAll: (params) => apiClient.get('/projects', { params }),
    create: (data) => apiClient.post('/projects', data),
    update: (id, data) => apiClient.put(`/projects/${id}`, data),
    delete: (id) => apiClient.delete(`/projects/${id}`)
  },
  tasks: {
    getAll: (params) => apiClient.get('/tasks', { params }),
    create: (data) => apiClient.post('/tasks', data),
    update: (id, data) => apiClient.put(`/tasks/${id}`, data),
    delete: (id) => apiClient.delete(`/tasks/${id}`)
  },
  members: {
    getAll: () => apiClient.get('/members'),
    add: (data) => apiClient.post('/members', data),
    delete: (id) => apiClient.delete(`/members/${id}`)
  },
  insights: {
    get: () => apiClient.get('/insights')
  },
  user: {
    updateProfile: (data) => apiClient.put('/user/profile', data),
    changePassword: (data) => apiClient.put('/user/change-password', data)
  }
};
