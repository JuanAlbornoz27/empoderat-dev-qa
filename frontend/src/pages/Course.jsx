import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderLearner';
import { resourceService } from '../services/api'; // Importar el servicio de recursos
import '../styles/CourseLearner.css';

const Curso = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Inicializar el hook de navegación
  const [cursoActual] = useState(location.state?.cursoSeleccionado || null);

  const handleIniciarLeccion = async (moduloId) => {
    console.log(`Iniciando lección del módulo: ${moduloId}`);
    
    try {
      // Obtener los recursos del módulo seleccionado
      const response = await resourceService.getResourcesByModule(moduloId);
      const recursos = response.data || [];
      
      // Navegar a la vista de ModulesList pasando el ID del módulo y los recursos como estado
      navigate('/modulos', { 
        state: { 
          moduloId: moduloId,
          moduloNombre: cursoActual.modulos.find(m => m.id === moduloId)?.nombre,
          cursoId: cursoActual.id,
          cursoNombre: cursoActual.nombre,
          recursos: recursos // Pasar los recursos obtenidos
        } 
      });
    } catch (error) {
      console.error('Error al obtener recursos del módulo:', error);
      // En caso de error, navegar igualmente pero sin recursos
      navigate('/modulos', { 
        state: { 
          moduloId: moduloId,
          moduloNombre: cursoActual.modulos.find(m => m.id === moduloId)?.nombre,
          cursoId: cursoActual.id,
          cursoNombre: cursoActual.nombre,
          recursos: [] // Lista vacía en caso de error
        } 
      });
    }
  };

  // Si el curso no está disponible, mostrar un indicador de carga
  if (!cursoActual) {
    return <div className="mis-cursos-container">No se encontró el curso seleccionado</div>;
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