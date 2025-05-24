import React, { useState } from 'react';
import CursoCard from './CourseCard';
import '../styles/CoursesLearner.css';

const Cursos = ({ cursos }) => {
  const [busqueda, setBusqueda] = useState('');
  const normalizeText = (text) => {
    return text
      .normalize('NFD')           
      .replace(/[\u0300-\u036f]/g, '') 
      .toLowerCase();             
  };
  
  const cursosFiltrados = cursos.filter(curso => {
    const nombreNormalizado = normalizeText(curso.nombre);
    const busquedaNormalizada = normalizeText(busqueda);
    return nombreNormalizado.includes(busquedaNormalizada);
  });
  
  // Función para manejar la inscripción
  const handleInscripcion = (cursoId) => {
    console.log(`Inscripción al curso con ID: ${cursoId}`);
    // Aquí puedes implementar la lógica de inscripción
    // Como una llamada a API, actualización de estado global, etc.
  };

  return (
    <div className="cursos-container">
      <h1 className="cursos-titulo">Cursos</h1>
      
      <div className="busqueda-container">
        <p className="busqueda-texto">¿Qué quieres aprender hoy?</p>
        <div className="busqueda-input-container">
          <input
            type="text"
            placeholder="Buscar Curso"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
          <span className="busqueda-icono">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>
      
      <div className="cursos-lista">
        {cursosFiltrados.map((curso, index) => (
          <CursoCard 
            key={index} 
            curso={curso} 
            onInscribir={handleInscripcion} 
          />
        ))}
      </div>
    </div>
  );
};

export default Cursos;