import React from "react";
import Header from "../components/Header";
import "../styles/ModulesList.css";
import { modulesData } from "../data/modulesData";

const ModulesList = () => {
  const handleNext = () => {
    console.log("Siguiente módulo");
  };

  return (
    <div className="modules-list-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Módulos"
        texto4="Contáctanos"
      />

      <div className="modules-list-content">
        <div className="modules-header">
          <h1>MÓDULOS</h1>
          <h2>PUNTADAS BÁSICAS</h2>
        </div>

        <div className="modules-container">
          {modulesData.map((module) => (
            <div key={module.id} className="module-item">
              <h3 className="module-title">{module.title}</h3>

              <div className="video-container">
                <div
                  className="video-thumbnail"
                  style={{
                    backgroundImage: `url(${
                      module.fileURL ||
                      module.videoThumbnail ||
                      "/src/assets/default-thumbnail.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="play-button">▶</div>
                </div>
              </div>

              <p className="module-description">{module.description}</p>
            </div>
          ))}
        </div>

        <div className="navigation-section">
          <button className="next-btn" onClick={handleNext}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulesList;
