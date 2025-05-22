import axios from 'axios';

// Create an Axios instance with base configuration
const API_URL = 'http://localhost:8080/api'; // Update with your Spring backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies/session
});

// Add request interceptor for authentication token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication services
export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/user'),
};

// Course services
export const courseService = {
    getAllCourses: () => api.get('/courses'),
    getCourseById: (id) => api.get(`/courses/${id}`),
    getCoursesByCategory: (category) => api.get(`/courses/category/${category}`),
};

export default api;