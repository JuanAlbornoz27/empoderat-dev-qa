import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursoCard from './CourseCard';
import '../styles/CoursesLearner.css';
import Header from "../components/HeaderLearner";
import { courseService } from '../services/api';

const MisCursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Llamada al endpoint correcto
        const response = await courseService.getMyCourses();
        
        // Extraer los datos de la respuesta
        const coursesData = response.data || [];
        setCursos(coursesData);
        
        console.log('Cursos cargados:', coursesData);
      } catch (err) {
        console.error('Error al cargar los cursos:', err);
        setError('Error al cargar los cursos inscriptos');
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // Función para continuar con el curso
  const handleContinuar = (cursoId) => {
    const cursoSeleccionado = cursos.find(curso => curso.id === cursoId);
    navigate(`/curso/${cursoId}`, { state: { cursoSeleccionado } });
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
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
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
          <p>No estás inscrito en ningún curso aún.</p>
          <button onClick={() => navigate('/cursos')}>
            Ver cursos disponibles
          </button>
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