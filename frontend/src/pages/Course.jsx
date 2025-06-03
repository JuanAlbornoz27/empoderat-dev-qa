import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderLearner';
import { moduleService, courseService } from '../services/api';
import '../styles/CourseLearner.css';

const Curso = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener información del curso
      const courseResponse = await courseService.getCourseById(courseId);
      setCourse(courseResponse.data);

      // Obtener módulos del curso para el usuario autenticado
      const modulesResponse = await moduleService.getModulesByCourseForUser(courseId);
      setModules(modulesResponse.data);

    } catch (err) {
      console.error('Error al cargar datos del curso:', err);
      if (err.response?.status === 403) {
        setError('No tienes acceso a este curso. Asegúrate de estar inscrito.');
      } else if (err.response?.status === 404) {
        setError('Curso no encontrado.');
      } else {
        setError('Error al cargar el curso. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarLeccion = (module) => {
    // Navegar a ModulesList pasando la información del módulo y curso
    navigate('/modulos', {
      state: {
        courseId: courseId,
        courseName: course.name || course.title,
        moduleId: module.id,
        moduleName: module.name,
        modules: modules // Pasar todos los módulos para navegación
      }
    });
  };

  if (loading) {
    return (
      <div className="mis-cursos-container">
        <Header
          texto1="Cursos"
          texto2="Mis cursos"
          texto3="Contáctanos"
        />
        <div className="loading-container">
          <p>Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-cursos-container">
        <Header
          texto1="Cursos"
          texto2="Mis cursos"
          texto3="Contáctanos"
        />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/my-courses')} className="back-btn">
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mis-cursos-container">
        <Header
          texto1="Cursos"
          texto2="Mis cursos"
          texto3="Contáctanos"
        />
        <div className="error-container">
          <p>No se encontró el curso seleccionado</p>
          <button onClick={() => navigate('/my-courses')} className="back-btn">
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-cursos-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Contáctanos"
      />
      <div className="curso-detalle-card">
        <h1 className="mis-cursos-titulo">Mis cursos</h1>
        
        <div className="curso-actual">
          <div className="curso-actual-imagen">
            <img 
              src={course.imageUrl || "/api/placeholder/300/200"} 
              alt={course.name || course.title || "Curso"} 
            />
          </div>
          <div className="curso-actual-info">
            <h2 className="curso-actual-nombre">{course.name || course.title}</h2>
            <p className="curso-actual-duracion">
              Duración estimada: {course.estimatedDuration || '24'} h
            </p>
            <p className="curso-actual-descripcion">
              {course.description}
            </p>
          </div>
        </div>

        <div className="modulos-seccion">
          <div className="modulos-header">
            <h3 className="modulos-titulo">Módulos</h3>
            <p className="modules-count">
              {modules.length} módulo{modules.length !== 1 ? 's' : ''} disponible{modules.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="modulos-lista">
            {modules.length === 0 ? (
              <div className="no-modules">
                <p>No hay módulos disponibles para este curso.</p>
              </div>
            ) : (
              modules.map((module) => (
                <div key={module.id} className="modulo-card">
                  <div className="modulo-imagen">
                    <img 
                      src={module.imageUrl || "/api/placeholder/150/100"} 
                      alt={module.name}
                    />
                    <div className="modulo-status">
                      {module.completed ? (
                        <span className="status-completed">✓ Completado</span>
                      ) : (
                        <span className="status-available">Disponible</span>
                      )}
                    </div>
                  </div>
                  <div className="modulo-info">
                    <h4 className="modulo-nombre">{module.name}</h4>
                    <p className="modulo-descripcion">{module.description}</p>
                  </div>
                  <button
                    className={`iniciar-leccion-btn ${module.completed ? 'completed' : 'available'}`}
                    onClick={() => handleIniciarLeccion(module)}
                    disabled={module.completed}
                  >
                    {module.completed ? 'Completado' : 'Tomar lección'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="navigation-section">
          <button
            className="back-btn"
            onClick={() => navigate('/my-courses')}
          >
            ← Volver a Mis Cursos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Curso;