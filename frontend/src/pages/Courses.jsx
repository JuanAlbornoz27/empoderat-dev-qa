import React, { useState, useEffect } from 'react';
import CursoCard from './CourseCard';
import { useNavigate } from 'react-router-dom';
import '../styles/CoursesLearner.css';
import Header from "../components/HeaderLearner";
import { aprendizService, courseService } from '../services/api';
import { mockCourses } from '../data/mockCourses';

const Cursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();

        // Adaptamos el formato de la respuesta del API al formato que espera el componente
        const adaptedCourses = response.data.map(course => ({
          id: course.id,
          nombre: course.title || course.name,
          descripcion: course.description,
          duracion: course.estimatedDuration || 24,
          portada: course.imageUrl || course.image || "/default-course-image.png"
        }));

        setCursos(adaptedCourses);
        setError(null);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        setError('No se pudieron cargar los cursos');

        // Fallback a datos mock en caso de error
        const adaptedMockCourses = mockCourses.map(course => ({
          id: course.id,
          nombre: course.title,
          descripcion: course.description,
          duracion: 24,
          portada: course.image || "/default-course-image.png"
        }));
        setCursos(adaptedMockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const normalizeText = (text) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const cursosFiltrados = cursos.filter(curso => {
    const nombreNormalizado = normalizeText(curso.nombre);
    const busquedaNormalizada = normalizeText(busqueda);
    return nombreNormalizado.includes(busquedaNormalizada);
  });

  // Función para manejar la inscripción
  const handleInscripcion = async (cursoId) => {
    try {
      setLoading(true);
      await aprendizService.enrollCourse(cursoId);
      alert('¡Te has inscrito exitosamente al curso!');
      navigate('/mis-cursos');
    } catch (err) {
      console.error('Error al inscribirse al curso:', err);
      if (err.response?.status === 400) {
        alert('Ya estás inscrito en este curso.');
      } else if (err.response?.status === 401) {
        alert('Debes iniciar sesión para inscribirte.');
        navigate('/login');
      } else {
        alert('Error al inscribirse al curso. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="cursos-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Contactanos"

      />
      <h1 className="cursos-titulo">CURSOS</h1>

      <div className="busqueda-container">
        <p className="busqueda-texto">¿Qué quieres aprender hoy?</p>
        <div className="busqueda-input-container">
          <input
            type="text"
            placeholder="Buscar Curso"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
          <span className="busqueda-icono">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Cargando cursos...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="cursos-lista">
          {cursosFiltrados.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              onInscribir={handleInscripcion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cursos;