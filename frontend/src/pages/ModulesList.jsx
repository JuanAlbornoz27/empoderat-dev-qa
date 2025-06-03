import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/HeaderLearner";
import { moduleService, resourceService } from "../services/api";
import "../styles/ModulesList.css";

const ModulesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos del estado de navegación
  const {
    courseId,
    courseName,
    moduleId,
    moduleName,
    modules = []
  } = location.state || {};

  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
    } else {
      setError('No se especificó un módulo válido');
      setLoading(false);
    }
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener información del módulo actual
      const moduleResponse = await moduleService.getModuleById(moduleId);
      setCurrentModule(moduleResponse.data);

      // Obtener recursos del módulo
      try {
        const resourcesResponse = await resourceService.getResourcesByModule(moduleId);
        setResources(resourcesResponse.data || []);
      } catch (resourceError) {
        console.warn('No se pudieron cargar los recursos:', resourceError);
        setResources([]);
      }

    } catch (err) {
      console.error('Error al cargar datos del módulo:', err);
      setError('Error al cargar el módulo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      // Marcar el módulo actual como completado
      await moduleService.markModuleAsCompleted(moduleId);

      console.log('Módulo completado:', currentModule?.name);

      // Regresar a la vista del curso
      navigate(`/curso/${courseId}`, {
        state: { moduleCompleted: moduleId }
      });

    } catch (error) {
      console.error('Error al completar el módulo:', error);
      alert('Error al completar el módulo. Inténtalo de nuevo.');
    }
  };

  const handleBack = () => {
    navigate(`/curso/${courseId}`);
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
          <button onClick={() => navigate('/my-courses')} className="back-btn">
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
          <h1>MÓDULOS</h1>
          <h2>{courseName || 'CURSO'}</h2>
          <h3 className="current-module">{currentModule?.name || moduleName}</h3>
        </div>

        <div className="modules-container">
          {/* Mostrar el módulo actual */}
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
                  <div className="play-button">▶</div>
                </div>
              </div>
              <p className="module-description">{currentModule.description}</p>
            </div>
          )}

          {/* Mostrar recursos si existen */}
          {resources.length > 0 && (
            <div className="resources-section">
              <h4>Recursos del Módulo</h4>
              <div className="resources-list">
                {resources.map((resource) => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-info">
                      <h5>{resource.title}</h5>
                      <p>{resource.description}</p>
                      {resource.type && (
                        <span className="resource-type">{resource.type}</span>
                      )}
                    </div>
                    {resource.fileUrl && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        Ver recurso
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="navigation-section">
          <button className="back-btn" onClick={handleBack}>
            ← Volver al Curso
          </button>
          <button className="next-btn" onClick={handleNext}>
            Módulo Completado →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulesList;