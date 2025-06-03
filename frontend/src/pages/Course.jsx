import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderLearner';
import { moduleService, courseService } from '../services/api';
import '../styles/CourseLearner.css';

const Curso = () => {
  const { cursoId } = useParams(); // Cambiado de courseId a cursoId para coincidir con la ruta
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cursoId) {
      fetchCourseData();
    }
  }, [cursoId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener información del curso
      const courseResponse = await courseService.getCourseById(cursoId);
      setCourse(courseResponse.data);

      // Obtener módulos del curso para el usuario autenticado
      const modulesResponse = await moduleService.getModulesByCourseForUser(cursoId);
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

  const handleIniciarLeccion = async (module) => {
    try {
      // Si el módulo ya está completado, solo navegar
      if (module.completed) {
        navigate(`/modulos`, {
          state: {
            courseId: cursoId,
            courseName: course.name || course.title,
            moduleId: module.id,
            moduleName: module.name,
            modules: modules,
            completed: true
          }
        });
        return;
      }

      // Marcar módulo como completado
      await moduleService.markModuleAsCompleted(module.id);

      // Actualizar el estado local
      setModules(prevModules =>
        prevModules.map(m =>
          m.id === module.id ? { ...m, completed: true } : m
        )
      );

      // Navegar a ModulesList con la información actualizada
      navigate(`/modulos`, {
        state: {
          courseId: cursoId,
          courseName: course.name || course.title,
          moduleId: module.id,
          moduleName: module.name,
          modules: modules.map(m =>
            m.id === module.id ? { ...m, completed: true } : m
          ),
          completed: true
        }
      });

      console.log('Módulo marcado como completado:', module.name);
    } catch (error) {
      console.error('Error al procesar módulo:', error);
      alert('Error al acceder al módulo. Inténtalo de nuevo.');
    }
  };

  // Función auxiliar para obtener el progreso del curso
  const getCourseProgress = () => {
    if (modules.length === 0) return 0;
    const completedCount = modules.filter(m => m.completed).length;
    return Math.round((completedCount / modules.length) * 100);
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
          <button onClick={() => navigate('/mis-cursos')} className="back-btn">
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
          <button onClick={() => navigate('/mis-cursos')} className="back-btn">
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
            {/* Agregar indicador de progreso */}
            <div className="course-progress">
              <div className="progress-info">
                <span>Progreso: {getCourseProgress()}%</span>
                <span>({modules.filter(m => m.completed).length}/{modules.length} módulos completados)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getCourseProgress()}%` }}
                ></div>
              </div>
            </div>
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
                  >
                    {module.completed ? 'Ver recursos' : 'Tomar lección'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="navigation-section">
          <button
            className="back-btn"
            onClick={() => navigate('/mis-cursos')}
          >
            ← Volver a Mis Cursos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Curso;