import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursoCard from './CourseCard';
import '../styles/CoursesLearner.css';
import Header from "../components/HeaderLearner";
import { enrollmentService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const MisCursos = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await enrollmentService.getEnrolledCourses();

        const adaptedCourses = response.data.map(course => ({
          id: course.id,
          nombre: course.title || course.name,
          descripcion: course.description,
          duracion: course.estimatedDuration || 24,
          portada: course.imageUrl || course.image || "/default-course-image.png"
        }));

        console.log('Cursos adaptados:', adaptedCourses);
        setCursos(adaptedCourses);

      } catch (err) {
        console.error('Error al cargar los cursos inscritos:', err);

        if (err.response?.status === 401) {
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('No se encontraron cursos inscritos.');
          setCursos([]);
        } else if (err.response?.status === 500) {
          setError('Error interno del servidor. Por favor, intenta más tarde.');
        } else {
          setError('Error al cargar los cursos inscritos. Verifica tu conexión.');
        }

        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [isAuthenticated, user, navigate]);

  // Función para continuar con el curso - CORREGIDA
  const handleContinuar = (cursoId) => {
    // Navegar usando parámetros de URL en lugar de state
    navigate(`/curso/${cursoId}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="cursos-container">
        <Header
          texto1="Cursos"
          texto2="Mis cursos"
          texto3="Contáctanos"
        />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando mis cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cursos-container">
        <Header
          texto1="Cursos"
          texto2="Mis cursos"
          texto3="Contáctanos"
        />
        <div className="error-container">
          <div className="error-message">
            <h3>Oops! Algo salió mal</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button className="retry-button" onClick={handleRetry}>
                Intentar de nuevo
              </button>
              <button className="browse-button" onClick={() => navigate('/cursos')}>
                Ver cursos disponibles
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cursos-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Contáctanos"
      />
      <h1 className="cursos-titulo">MIS CURSOS</h1>

      {cursos.length === 0 ? (
        <div className="no-courses-container">
          <div className="no-courses-message">
            <h3>No tienes cursos inscritos</h3>
            <p>Explora nuestro catálogo y encuentra el curso perfecto para ti.</p>
            <button className="browse-courses-button" onClick={() => navigate('/cursos')}>
              Explorar cursos
            </button>
          </div>
        </div>
      ) : (
        <div className="cursos-lista">
          {cursos.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              onInscribir={handleContinuar}
              botonTexto="Tomar lección"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCursos;