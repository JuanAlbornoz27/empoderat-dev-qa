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
    // NEW CRUD methods for admin
    createCourse: (courseData) => api.post('/courses', courseData),
    updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
    updateCourseStatus: (id, status) => api.patch(`/courses/${id}/status`, { status }),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
    
    // Search and filter
    searchCourses: (query) => api.get(`/courses/search?q=${encodeURIComponent(query)}`),
    getCoursesByStatus: (status) => api.get(`/courses/status/${status}`),
    
    // Image upload
    uploadCourseImage: (id, formData) => api.post(`/courses/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    // Pagination
    getCoursesWithPagination: (page = 0, size = 10, sortBy = 'id') => 
        api.get(`/courses/page?page=${page}&size=${size}&sort=${sortBy}`),
};

// Module services
export const moduleService = {
    // Get all modules for a specific course
    getModulesByCourse: (courseId) => api.get(`/modules/course/${courseId}`),
    
    // Get a specific module by ID
    getModuleById: (id) => api.get(`/modules/${id}`),
    
    // Create a new module
    createModule: (moduleData) => api.post('/modules', moduleData),
    
    // Update an existing module
    updateModule: (id, moduleData) => api.put(`/modules/${id}`, moduleData),
    
    // Update module status only
    updateModuleStatus: (id, status) => api.patch(`/modules/${id}/status`, { status }),
    
    // Delete a module
    deleteModule: (id) => api.delete(`/modules/${id}`),
    
    // Upload module image
    uploadModuleImage: (id, formData) => api.post(`/modules/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    // Get module resources
    getModuleResources: (moduleId) => api.get(`/modules/${moduleId}/resources`),
};

// Category service - Ampliado con todas las operaciones CRUD
export const categoryService = {
    // Get all categories
    getAllCategories: () => api.get('/categories'),
    
    // Get a specific category by ID
    getCategoryById: (id) => api.get(`/categories/${id}`),
    
    // Create a new category
    createCategory: (categoryData) => api.post('/categories', categoryData),
    
    // Update an existing category
    updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
    
    // Delete a category
    deleteCategory: (id) => api.delete(`/categories/${id}`),
    
    // Search categories
    searchCategories: (query) => api.get(`/categories/search?q=${encodeURIComponent(query)}`),
    
    // Get categories with pagination
    getCategoriesWithPagination: (page = 0, size = 10, sortBy = 'id') => 
        api.get(`/categories/page?page=${page}&size=${size}&sort=${sortBy}`),
    
    // Upload category image
    uploadCategoryImage: (id, formData) => api.post(`/categories/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    // Get courses by category
    getCoursesByCategory: (categoryId) => api.get(`/categories/${categoryId}/courses`),
    
    // Get category statistics
    getCategoryStats: (id) => api.get(`/categories/${id}/stats`),
};

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;