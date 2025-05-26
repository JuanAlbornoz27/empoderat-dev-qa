import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Funciones de manejo de tokens
const getAuthToken = () => localStorage.getItem('authToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('authToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
const clearAuthTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para responses y refresh token
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await refreshAuthToken(refreshToken);
          setAuthTokens(response.data.accessToken, response.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        clearAuthTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Servicio de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.accessToken) {
      setAuthTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify({
        userId: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    return response;
  },

  register: (userData) => apiClient.post('/auth/register', userData),

  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', null, { params: { refreshToken } });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuthTokens();
    }
  },

  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  isAuthenticated: () => !!getAuthToken(),

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  }
};

// Servicio de cursos
export const courseService = {
  getAllCourses: () => apiClient.get('/courses'),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  createCourse: (courseData) => apiClient.post('/courses', courseData),
  updateCourse: (id, courseData) => apiClient.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  updateCourseStatus: (id, status) => apiClient.patch(`/courses/${id}/status`, { status }),
  uploadCourseImage: (id, formData) => apiClient.post(`/courses/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCoursesByCategory: (categoryId) => apiClient.get(`/courses/category/${categoryId}`),
  searchCourses: (term) => apiClient.get(`/courses/search`, { params: { term } })
};

// Servicio de categorías
export const categoryService = {
  getAllCategories: () => apiClient.get('/categories'),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  createCategory: (categoryData) => apiClient.post('/categories', categoryData),
  updateCategory: (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
  uploadCategoryImage: (id, formData) => apiClient.post(`/categories/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Servicio de módulos
export const moduleService = {
  getModulesByCourse: (courseId) => apiClient.get(`/modules/course/${courseId}`),
  getModuleById: (id) => apiClient.get(`/modules/${id}`),
  createModule: (moduleData) => apiClient.post('/modules', moduleData),
  updateModule: (id, moduleData) => apiClient.put(`/modules/${id}`, moduleData),
  deleteModule: (id) => apiClient.delete(`/modules/${id}`),
  updateModuleStatus: (id, status) => apiClient.patch(`/modules/${id}/status`, { status }),
  uploadModuleResource: (id, formData) => apiClient.post(`/modules/${id}/resource`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Servicio de usuario
export const userService = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data)
};

// Servicio de aprendiz
export const aprendizService = {
  getCourses: () => apiClient.get('/aprendiz/courses'),
  enrollCourse: (courseId) => apiClient.post(`/aprendiz/courses/${courseId}/enroll`),
  getProgress: (courseId) => apiClient.get(`/aprendiz/courses/${courseId}/progress`)
};

// Servicio de administrador
export const adminService = {
  getUsers: () => apiClient.get('/admin/users'),
  updateUser: (userId, userData) => apiClient.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`)
};

// Función auxiliar para refresh token
const refreshAuthToken = (refreshToken) => {
  return axios.post(`${API_BASE_URL}/auth/refresh`, null, {
    params: { refreshToken }
  });
};

export default apiClient;