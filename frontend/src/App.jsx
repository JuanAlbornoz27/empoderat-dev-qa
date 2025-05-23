import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import Course from './pages/Course';
import Header from './pages/HeaderLearner';
import Profile from './pages/ProfileInfo';
import './styles/global.css';
import { getCourses } from './data/apiService';



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
        </Routes>
      </main>
    </div>
  );
}

export default App;