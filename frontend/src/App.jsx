import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModuleManagement from './pages/ModuleManagement';
import ModulesList from './pages/ModulesList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirigir la ruta raíz a gestión de módulos */}
          <Route path="/" element={<Navigate to="/gestion-modulos" replace />} />
          
          {/* Página de gestión de módulos (primera imagen) */}
          <Route path="/gestion-modulos" element={<ModuleManagement />} />
          
          {/* Página de lista de módulos (tercera imagen) */}
          <Route path="/modulos" element={<ModulesList />} />
          
          {/* Rutas del header para navegación */}
          <Route path="/cursos" element={<div>Página de Cursos</div>} />
          <Route path="/mis-cursos" element={<div>Página de Mis Cursos</div>} />
          <Route path="/contacto" element={<div>Página de Contacto</div>} />
          <Route path="/perfil" element={<div>Página de Perfil</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;