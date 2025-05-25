import axios from 'axios';

// Configuración base de axios
const API_URL = 'http://localhost:8080/api';

// Crear instancia de axios con configuración común
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación a las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    return Promise.resolve();
  }
};

// Servicios de cursos
export const courseService = {
  // Obtiene todos los cursos (sin paginación)
  getAllCourses: () => api.get('/courses'),
  
  // Obtiene un curso por su ID
  getCourseById: (id) => api.get(`/courses/${id}`),
  
  // Crea un nuevo curso
  createCourse: (courseData) => api.post('/courses', courseData),
  
  // Actualiza un curso existente
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  
  // Elimina un curso
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  
  // Actualiza el estado de un curso (activo/inactivo)
  updateCourseStatus: (id, status) => api.patch(`/courses/${id}/status`, { status }),
  
  // Subir imagen para un curso
  uploadCourseImage: (id, formData) => api.post(`/courses/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Servicios de categorías
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  uploadCategoryImage: (id, formData) => api.post(`/categories/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Servicios de módulos
export const moduleService = {
  getModulesByCourse: (courseId) => api.get(`/modules/course/${courseId}`),
  getModuleById: (id) => api.get(`/modules/${id}`),
  createModule: (moduleData) => api.post('/modules', moduleData),
  updateModule: (id, moduleData) => api.put(`/modules/${id}`, moduleData),
  deleteModule: (id) => api.delete(`/modules/${id}`),
  updateModuleStatus: (id, status) => api.patch(`/modules/${id}/status`, { status }),
  uploadModuleResource: (id, formData) => api.post(`/modules/${id}/resource`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Manejo de errores general
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error API:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      console.log('Sesión expirada o token inválido');
      authService.logout();
    }
    
    return Promise.reject(error);
  }
);

export default api;