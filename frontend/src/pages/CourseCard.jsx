import React from 'react';
import '../styles/CoursesLearner.css';

const CursoCard = ({ curso, onInscribir, botonTexto = "Inscribirse" }) => {
  return (
    <div className="curso-card">
      <div className="curso-imagen">
        <img src={curso.portada} alt={curso.nombre} />
      </div>
      <div className="curso-info">
        <div className="curso-info-texto">
          <h2 className="curso-nombre">{curso.nombre}</h2>
          <p className="curso-duracion">Duración estimada: {curso.duracion} h</p>
          <p className="curso-descripcion">{curso.descripcion}</p>
        </div>
        <button
          className="curso-inscribirse"
          onClick={() => onInscribir(curso.id)}
        >
          {botonTexto}
        </button>
      </div>
    </div>
  );
};

export default CursoCard;