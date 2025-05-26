import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseInfo from './pages/CourseInfo';
import ModuleManagementAll from './pages/ModuleManagementAll';
import CourseManagement from './pages/CourseManagement';
import CategoryManagement from './pages/CategoryManagement';
import ModuleManagement from './pages/ModuleManagement';
import ModulesList from './pages/ModulesList';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import Course from './pages/Course';
import Profile from './pages/ProfileInfo';
import Unauthorized from './components/Unauthorized';
import { getCourses } from './data/apiService';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los cursos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas generales */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute>
              <CourseInfo />
            </ProtectedRoute>
          } />

          {/* Rutas protegidas para administrador */}
          <Route path="/admin/courses" element={
            <ProtectedRoute adminOnly>
              <CourseManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/create" element={
            <ProtectedRoute adminOnly>
              <CourseManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/edit/:id" element={
            <ProtectedRoute adminOnly>
              <CourseManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/modules" element={
            <ProtectedRoute adminOnly>
              <ModuleManagementAll />
            </ProtectedRoute>
          } />
          <Route path="/admin/modules/course/:courseId" element={
            <ProtectedRoute adminOnly>
              <ModuleManagementAll />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute adminOnly>
              <CategoryManagement />
            </ProtectedRoute>
          } />

          {/* Rutas protegidas para aprendiz */}
          <Route path="/cursos" element={
            <ProtectedRoute aprendizOnly>
              <Courses cursos={courses} />
            </ProtectedRoute>
          } />
          <Route path="/mis-cursos" element={
            <ProtectedRoute aprendizOnly>
              <MyCourses cursos={courses} />
            </ProtectedRoute>
          } />
          <Route path="/curso/:cursoId" element={
            <ProtectedRoute aprendizOnly>
              <Course cursos={courses} />
            </ProtectedRoute>
          } />
          <Route path="/modulos" element={
            <ProtectedRoute aprendizOnly>
              <ModulesList />
            </ProtectedRoute>
          } />

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}