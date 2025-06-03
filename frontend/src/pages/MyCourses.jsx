import React from 'react';
import { useNavigate } from 'react-router-dom';
import CursoCard from './CourseCard';
import '../styles/CoursesLearner.css';
import Header from "../components/HeaderLearner";

const MisCursos = ({ cursos }) => {
  const navigate = useNavigate();
  
  // Función para continuar con el curso
  const handleContinuar = (cursoId) => {
    console.log(`Continuando con el curso ID: ${cursoId}`);
    // Buscar el curso seleccionado
    const cursoSeleccionado = cursos.find(curso => curso.id === cursoId);
    
    // Navegar a la página del curso con el ID correspondiente
    // y pasar el curso como estado
    navigate(`/curso/${cursoId}`, { state: { cursoSeleccionado } });
  };

  return (
    <div className="cursos-container">
      <Header
        texto1="Cursos"
        texto2="Mis cursos"
        texto3="Contáctanos"
      />
      <h1 className="cursos-titulo">MIS CURSOS</h1>
      <div className="cursos-lista">
        {cursos.map((curso, index) => (
          <CursoCard 
            key={index} 
            curso={curso} 
            onInscribir={handleContinuar}
            botonTexto="Tomar lección" 
          />
        ))}
      </div>
    </div>
  );
};

export default MisCursos;