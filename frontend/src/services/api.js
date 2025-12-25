import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Public Blog API
export const publicBlogAPI = {
  getAllPosts: () => api.get('/public/posts'),
  getPostById: (id) => api.get(`/public/posts/${id}`),
};

// Admin Blog API
export const adminBlogAPI = {
  getAllPosts: () => api.get('/admin/posts'),
  getPostById: (id) => api.get(`/admin/posts/${id}`),
  createPost: (postData) => api.post('/admin/posts', postData),
  updatePost: (id, postData) => api.put(`/admin/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/posts/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/posts/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultipleImages: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return api.post('/admin/posts/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;

