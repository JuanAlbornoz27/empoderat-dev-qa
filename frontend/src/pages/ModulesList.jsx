import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/HeaderLearner";
import "../styles/ModulesList.css";
import { moduleService, resourceService } from "../services/api";

const ModulesList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener datos del state o usar valores por defecto
  const {
    courseId,
    courseName = "Curso",
    moduleId,
    moduleName = "Módulo",
    modules = [],
    completed = false
  } = location.state || {};

  const [currentModule, setCurrentModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allModules, setAllModules] = useState(modules);

  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Información del módulo no disponible");
      setLoading(false);
      return;
    }

    fetchModuleData();
  }, [moduleId, courseId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener información detallada del módulo actual
      const moduleResponse = await moduleService.getModuleById(moduleId);
      setCurrentModule(moduleResponse.data);

      // Obtener recursos del módulo
      try {
        const resourcesResponse = await resourceService.getResourcesByModule(moduleId);
        setResources(resourcesResponse.data || []);
      } catch (resourceError) {
        console.log("No se encontraron recursos para este módulo");
        setResources([]);
      }

      // Si no tenemos todos los módulos, obtenerlos
      if (allModules.length === 0) {
        const modulesResponse = await moduleService.getModulesByCourseForUser(courseId);
        setAllModules(modulesResponse.data);
      }

    } catch (err) {
      console.error('Error al cargar datos del módulo:', err);
      setError('Error al cargar la información del módulo');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const currentIndex = allModules.findIndex(m => m.id === parseInt(moduleId));
    const nextModule = allModules[currentIndex + 1];

    // Marcar el módulo actual como completado si no lo está
    if (!completed) {
      await handleMarkAsCompleted();
    }

    if (nextModule) {
      // Si hay un siguiente módulo, navegar a él
      navigate('/modulos', {
        state: {
          courseId,
          courseName,
          moduleId: nextModule.id,
          moduleName: nextModule.name,
          modules: allModules,
          completed: nextModule.completed
        }
      });
    } else {
      alert('¡Felicitaciones! Has completado todos los módulos del curso.');
       navigate(`/mis-cursos`, {
        state: {
          courseCompleted: true
        }
      });
    }
  };

  const handlePrevious = () => {
    const currentIndex = allModules.findIndex(m => m.id === parseInt(moduleId));
    const prevModule = allModules[currentIndex - 1];

    if (prevModule) {
      navigate('/modulos', {
        state: {
          courseId,
          courseName,
          moduleId: prevModule.id,
          moduleName: prevModule.name,
          modules: allModules,
          completed: prevModule.completed
        }
      });
    }
  };

  const getCurrentModuleIndex = () => {
    return allModules.findIndex(m => m.id === parseInt(moduleId)) + 1;
  };

  const handleMarkAsCompleted = async () => {
    if (completed) return;

    try {
      await moduleService.markModuleAsCompleted(moduleId);

      // Actualizar el estado local
      const updatedModules = allModules.map(m =>
        m.id === parseInt(moduleId) ? { ...m, completed: true } : m
      );
      setAllModules(updatedModules);

      // Actualizar el módulo actual
      setCurrentModule(prev => ({ ...prev, completed: true }));

      alert('¡Módulo completado exitosamente!');
    } catch (error) {
      console.error('Error al marcar módulo como completado:', error);
      alert('Error al marcar el módulo como completado');
    }
  };

  if (loading) {
    return (
      <div className="modules-list-container">
        <Header
          texto1="Cursos"
          texto2="Mis cursos"
          texto3="Contáctanos"
        />
        <div className="loading-container">
          <p>Cargando módulo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modules-list-container">
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

  return (
    <div className="modules-list-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Contáctanos"
      />

      <div className="modules-list-content">
        <div className="modules-header">
          <div className="course-info">
            <h1>{courseName}</h1>
            <h2>{moduleName}</h2>
            <div className="module-progress-info">
              <span>Módulo {getCurrentModuleIndex()} de {allModules.length}</span>
              <br />
              {/* {completed ? (

                <span className="completed-badge">✓ Completado</span>
              ) : (
                <span className="pending-badge">Pendiente</span>
              )} */}
            </div>
          </div>
          <button
            className="back-btn"
            onClick={() => navigate(`/curso/${courseId}`)}
          >
            ← Volver al Curso
          </button>
        </div>

        <div className="modules-container">
          {currentModule && (
            <div className="module-item current-module">
              <h3 className="module-title">{currentModule.name}</h3>

              <div className="video-container">
                <div
                  className="video-thumbnail"
                  style={{
                    backgroundImage: `url(${currentModule.imageUrl ||
                      "/src/assets/default-thumbnail.jpg"
                      })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className={`play-button ${completed ? 'completed' : ''}`}>
                    {completed ? '✓' : '▶'}
                  </div>
                </div>
              </div>

              <p className="module-description">{currentModule.description}</p>

              {/* Sección de recursos */}
              <div className="resources-section">
                <h4>Recursos del módulo</h4>
                {resources.length > 0 ? (
                  <div className="resources-list">
                    {resources.map((resource) => (
                      <div key={resource.id} className="resource-item">
                        <div className="resource-info">
                          <h5>{resource.name}</h5>
                          <p>{resource.description}</p>
                          <span className="resource-type">{resource.type}</span>
                        </div>
                        {resource.fileUrl && (
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link"
                          >
                            Descargar
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-resources">No hay recursos disponibles para este módulo.</p>
                )}
              </div>

              f
            </div>
          )}
        </div>

        <div className="navigation-section">
          <div className="nav-buttons">
            <button
              className="prev-btn"
              onClick={handlePrevious}
              disabled={getCurrentModuleIndex() === 1}
            >
              ← Anterior
            </button>

            <div className="module-counter">
              {getCurrentModuleIndex()} / {allModules.length}
            </div>

            <button
              className="next-btn"
              onClick={() => {
                handleNext();
                handleMarkAsCompleted();
              }}
              disabled={getCurrentModuleIndex() === allModules.length && completed}
            >
              {getCurrentModuleIndex() === allModules.length ? 'Finalizar curso' : 'Siguiente'} →
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ModulesList;