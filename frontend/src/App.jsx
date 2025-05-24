import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import Course from './pages/Course';
import Header from './pages/HeaderLearner';
import Profile from './pages/ProfileInfo';
import './styles/global.css';
import { getCourses } from './data/apiService';

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



function App() {
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

  if (loading) {
    return (
      <div className="app">
        <header>
          <Header 
            texto1="Cursos" 
            texto2="Mis cursos"
            texto3="Modulos"
            texto4="Contáctanos"
          />
        </header>
        <main>
          <div className="loading">Cargando cursos...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header>
          <Header 
            texto1="Cursos" 
            texto2="Mis cursos"
            texto3="Modulos"
            texto4="Contáctanos"
          />
        </header>
        <main>
          <div className="error">
            <h2>Error al cargar los cursos</h2>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <Header 
          texto1="Cursos" 
          texto2="Mis cursos"
          texto3="Modulos"
          texto4="Contáctanos"
        />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Courses cursos={courses} />} />
          <Route path="/cursos" element={<Courses cursos={courses} />} />
          <Route path="/mis-cursos" element={<MyCourses cursos={courses} />} />
          <Route path="/curso/:cursoId" element={<Course cursos={courses} />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/modulos" element={<div>Contenido de Módulos (Por implementar)</div>} />
          <Route path="/contacto" element={<div>Formulario de Contacto (Por implementar)</div>} />
          <Route path="*" element={<div>Página no encontrada</div>} />
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:id" element={<CourseInfo />} />
        
        {/* Rutas de administración de cursos */}
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/courses/create" element={<CourseManagement />} />
        <Route path="/admin/courses/edit/:id" element={<CourseManagement />} />
        
        {/* Rutas de administración de módulos */}
        <Route path="/admin/modules" element={<ModuleManagementAll />} />
        <Route path="/admin/modules/course/:courseId" element={<ModuleManagementAll />} />

        {/* Rutas de administración de categorías */}
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="/admin/categories/create" element={<CategoryManagement />} />
        <Route path="/admin/categories/edit/:id" element={<CategoryManagement />} />

        {/* Redirigir la ruta raíz a gestión de módulos */}
        {/* <Route path="/" element={<Navigate to="/gestion-modulos" replace />} /> */}
        
        {/* Página de gestión de módulos (primera imagen) */}
        <Route path="/gestion-modulos" element={<ModuleManagement />} />
        
        {/* Página de lista de módulos (tercera imagen) */}
        <Route path="/modulos" element={<ModulesList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
