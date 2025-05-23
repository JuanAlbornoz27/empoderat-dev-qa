import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/CourseLearner.css';

const Curso = () => {
  const location = useLocation();
  const [cursoActual] = useState(location.state?.cursoSeleccionado || null);

  const handleIniciarLeccion = (moduloId) => {
    console.log(`Iniciando lección del módulo: ${moduloId}`);
    // Aquí implementarías la lógica para iniciar una lección
  };

  // Si el curso no está disponible, mostrar un indicador de carga
  if (!cursoActual) {
    return <div className="mis-cursos-container">No se encontró el curso seleccionado</div>;
  }

  return (
    <div className="mis-cursos-container">
      <div className="curso-detalle-card">
        <h1 className="mis-cursos-titulo">Mis cursos</h1>
        
        <div className="curso-actual">
          <div className="curso-actual-imagen">
            <img src={cursoActual.portada || "/api/placeholder/300/200"} alt={cursoActual.nombre || "Curso"} />
          </div>
          <div className="curso-actual-info">
            <h2 className="curso-actual-nombre">{cursoActual.nombre}</h2>
            <p className="curso-actual-duracion">
              Duración estimada: {cursoActual.duracion} h
            </p>
            <p className="curso-actual-descripcion">
              {cursoActual.descripcion}
            </p>
          </div>
        </div>

        <div className="modulos-seccion">
          <div className="modulos-header">
            <h3 className="modulos-titulo">Módulos</h3>
          </div>

          <div className="modulos-lista">
            {cursoActual.modulos && cursoActual.modulos.map((modulo) => (
              <div key={modulo.id} className="modulo-card">
                <div className="modulo-info">
                  <h4 className="modulo-nombre">{modulo.nombre}</h4>
                  <p className="modulo-estado">Estado: {modulo.estado}</p>
                </div>
                <button
                  className={`iniciar-leccion-btn ${modulo.completado ? 'Finalizado' : 'Pendiente'}`}
                  onClick={() => handleIniciarLeccion(modulo.id)}
                >
                  Iniciar lección
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curso;