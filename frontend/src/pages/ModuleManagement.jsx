import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/HeaderAdmin";
import "../styles/ModuleManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { moduleService, resourceService } from '../services/api';

const ModuleManagement = () => {
  const location = useLocation();
  const moduleName = location.state?.moduleName || "Módulo no especificado";

  const [moduleData, setModuleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [modules, setModules] = useState([

  ]);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setIsLoading(true);
        const moduleId = location.state?.moduleId;
        
        if (moduleId) {
          // Obtener datos del módulo
          const moduleResponse = await moduleService.getModuleById(moduleId);
          if (moduleResponse && moduleResponse.data) {
            setModuleData(moduleResponse.data);
            
            // Obtener recursos del módulo
            const resourcesResponse = await resourceService.getResourcesByModule(moduleId);
            if (resourcesResponse && resourcesResponse.data) {
              // Convertir los recursos al formato usado por el componente
              const formattedResources = resourcesResponse.data.map((resource, index) => ({
                id: resource.id,
                title: `${index + 1}. ${resource.title}`,
                description: resource.description,
                hasVideo: resource.type === 'VIDEO',
                fileName: resource.fileName,
                fileURL: resource.content,
                resourceId: resource.id
              }));
              
              setModules(formattedResources);
            }
          } else {
            setError("No se pudo cargar la información del módulo");
          }
        } else {
          setError("No se especificó un ID de módulo");
        }
      } catch (err) {
        console.error("Error al cargar el módulo:", err);
        setError("Error al cargar el módulo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleData();
  }, [location.state]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Genera una URL temporal
      setUploadedFile({ file, fileURL }); // Guarda el archivo y su URL
    }
  };

  const handleSave = async () => {
    if (moduleTitle && moduleDescription && uploadedFile) {
      try {
        // 1. Primero subimos el archivo
        const formData = new FormData();
        formData.append('file', uploadedFile.file);
        
        const uploadResponse = await resourceService.uploadResourceFile(formData);
        const fileUrl = uploadResponse.data.fileUrl;
        
        // 2. Creamos el recurso en MongoDB
        const resourceData = {
          courseId: moduleData.courseId, // ID del curso al que pertenece el módulo
          moduleId: moduleData.id,       // ID del módulo actual
          title: moduleTitle,
          description: moduleDescription,
          type: determineResourceType(uploadedFile.file.type),
          content: fileUrl,              // URL del archivo subido
          fileName: uploadedFile.file.name,
          contentType: uploadedFile.file.type,
          createdAt: new Date().toISOString()
        };
        
        const response = await resourceService.createResource(resourceData);
        
        // 3. Actualizar el estado local con el nuevo recurso
        const newModule = {
          id: modules.length + 1,
          title: `${modules.length + 1}. ${moduleTitle}`,
          description: moduleDescription,
          hasVideo: resourceData.type === 'VIDEO',
          fileName: uploadedFile.file.name,
          fileURL: fileUrl,
          resourceId: response.data.id // Guardamos el ID del recurso en MongoDB
        };
        
        setModules([...modules, newModule]);

        // Reset form
        setModuleTitle("");
        setModuleDescription("");
        setUploadedFile(null);

        alert("Recurso guardado exitosamente");
      } catch (error) {
        console.error("Error al guardar el recurso:", error);
        alert("Error al guardar el recurso: " + (error.response?.data?.message || error.message));
      }
    } else {
      alert("Por favor complete todos los campos");
    }
  };

  // Función auxiliar para determinar el tipo de recurso
  const determineResourceType = (mimeType) => {
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType === 'application/pdf') return 'DOCUMENT';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    return 'DOCUMENT'; // Default
  };

  const handleDelete = async (id, resourceId) => {
    try {
      if (resourceId) {
        // Si tenemos un resourceId, eliminar de la base de datos
        await resourceService.deleteResource(resourceId);
      }
      
      // Actualizar el estado local
      setModules(modules.filter((module) => module.id !== id));
      alert("Recurso eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el recurso:", error);
      alert("Error al eliminar el recurso: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="module-management-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Módulos"
        texto4="Contáctanos"
      />

      <div className="module-management-content">
        <div className="module-header">
          <h1>Recursos de módulo</h1>
          {isLoading ? (
            <h2>Cargando información del módulo...</h2>
          ) : error ? (
            <h2 className="error-message">{error}</h2>
          ) : moduleData ? (
            <h2 className="module-name-badge">{moduleData.name}</h2>
          ) : (
            <h2>Módulo no encontrado</h2>
          )}
        </div>

        <div className="module-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Añade un título"
              className="title-input"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
            />
          </div>

          <div className="form-group upload-section">
            <div className="upload-area">
              {/* Reemplazar la imagen con el ícono de FontAwesome */}
              <FontAwesomeIcon
                icon="cloud-arrow-up"
                style={{ color: "#b29cc0", fontSize: "3rem" }}
                className="upload-icon"
              />
              <h3>Buscar archivos</h3>
              <p>Arrastre y suelte archivos aquí</p>
              <input
                type="file"
                accept="video/*,image/*,.gif"
                onChange={handleFileUpload}
                className="file-input"
              />
            </div>
            {uploadedFile && (
              <div className="uploaded-file-info">
                <p>Archivo seleccionado: {uploadedFile.name}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <textarea
              placeholder="Añada una descripción"
              className="description-input"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
            />
          </div>
          <div className="module-actions">
            <button className="save-btn" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>

        <div className="existing-modules-container">
          {modules.map((module) => (
            <div key={module.id} className="existing-module">
              <div className="module-info">
                <h3>{module.title}</h3>
                <div className="module-content-wrapper">
                  <div
                    className="video-placeholder"
                    style={{
                      backgroundImage: `url(${
                        module.fileURL || "/src/assets/default-thumbnail.jpg"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="play-button">▶</div>
                  </div>
                  {module.description && (
                    <p className="module-description">{module.description}</p>
                  )}
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(module.id, module.resourceId)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleManagement;
