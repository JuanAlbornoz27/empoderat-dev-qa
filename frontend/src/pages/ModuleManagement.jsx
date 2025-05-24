import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/ModuleManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModuleManagement = () => {
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "1. Puntada Recta",
      description:
        "La puntada recta es la costura básica y más utilizada en la confección de prendas. Consiste en una línea continua de puntadas equidistantes que unen dos piezas de tela.",
      hasVideo: true,
      fileName: "puntada-recta.mp4",
    },
    {
      id: 2,
      title: "2. Puntada En zigzag",
      description:
        "La puntada en zigzag es esencial para evitar que los bordes de la tela se deshilachen y para costuras elásticas.",
      hasVideo: true,
      fileName: "puntada-zigzag.mp4",
    },
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Genera una URL temporal
      setUploadedFile({ file, fileURL }); // Guarda el archivo y su URL
    }
  };

  const handleSave = () => {
    if (moduleTitle && moduleDescription && uploadedFile) {
      const newModule = {
        id: modules.length + 1,
        title: `${modules.length + 1}. ${moduleTitle}`,
        description: moduleDescription,
        hasVideo: true,
        fileName: uploadedFile.file.name,
        fileURL: uploadedFile.fileURL, // Incluye la URL del archivo
      };
      setModules([...modules, newModule]);

      // Reset form
      setModuleTitle("");
      setModuleDescription("");
      setUploadedFile(null);

      alert("Módulo guardado exitosamente");
    } else {
      alert("Por favor complete todos los campos");
    }
  };

  const handleDelete = (id) => {
    setModules(modules.filter((module) => module.id !== id));
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
          <h1>Módulo</h1>
          <h2>PUNTADAS BÁSICAS</h2>
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
                onClick={() => handleDelete(module.id)}
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
