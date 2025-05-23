import React, { useState } from 'react';
import '../styles/ProfileLearner.css';

const Perfil = ({ usuarioInicial }) => {
  // Estado para manejar los datos del usuario
  const [usuario, setUsuario] = useState({
    nombre: usuarioInicial?.nombre || 'Pepita',
    apellido: usuarioInicial?.apellido || 'Perez',
    email: usuarioInicial?.email || 'Pepita.Perez@Gmail.com',
    cedula: usuarioInicial?.cedula || 'c.c. 1053789547',
    telefono: usuarioInicial?.telefono || '3116789543',
    fechaNacimiento: usuarioInicial?.fechaNacimiento || '15/07/05',
    ciudad: usuarioInicial?.ciudad || 'Tunja - Boyacá',
    avatar: usuarioInicial?.avatar || null
  });

  // Estado para controlar si los campos están en modo edición
  const [modoEdicion, setModoEdicion] = useState(false);
  
  // Estado temporal para los cambios antes de guardar
  const [usuarioTemporal, setUsuarioTemporal] = useState({ ...usuario });

  // Función para manejar cambios en los inputs
  const handleInputChange = (campo, valor) => {
    setUsuarioTemporal(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Función para guardar los cambios
  const handleGuardarCambios = () => {
    setUsuario({ ...usuarioTemporal });
    setModoEdicion(false);
    console.log('Cambios guardados:', usuarioTemporal);
    // Aquí implementarías la llamada a la API para guardar los cambios
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setUsuarioTemporal({ ...usuario });
    setModoEdicion(false);
  };

  // Función para activar el modo edición
  const handleActivarEdicion = () => {
    setModoEdicion(true);
  };

  // Función para manejar el cambio de avatar
  const handleCambioAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUsuarioTemporal(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const datosUsuario = modoEdicion ? usuarioTemporal : usuario;

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-avatar-section">
          <div className="perfil-avatar">
            {datosUsuario.avatar ? (
              <img src={datosUsuario.avatar} alt="Avatar del usuario" />
            ) : (
              <div className="avatar-default">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
            {modoEdicion && (
              <div className="avatar-edit-overlay">
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleCambioAvatar}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-input" className="avatar-edit-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </label>
              </div>
            )}
          </div>
          
          <h1 className="perfil-nombre-completo">
            {datosUsuario.nombre} {datosUsuario.apellido}
          </h1>
        </div>

        <div className="perfil-datos">
          <div className="campo-grupo">
            <label className="campo-label">Nombre</label>
            {modoEdicion ? (
              <input
                type="text"
                value={datosUsuario.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="campo-input"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.nombre}</div>
            )}
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Apellido</label>
            {modoEdicion ? (
              <input
                type="text"
                value={datosUsuario.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                className="campo-input"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.apellido}</div>
            )}
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Email</label>
            {modoEdicion ? (
              <input
                type="email"
                value={datosUsuario.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="campo-input"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.email}</div>
            )}
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Cédula</label>
            {modoEdicion ? (
              <input
                type="text"
                value={datosUsuario.cedula}
                onChange={(e) => handleInputChange('cedula', e.target.value)}
                className="campo-input"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.cedula}</div>
            )}
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Teléfono</label>
            {modoEdicion ? (
              <input
                type="tel"
                value={datosUsuario.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="campo-input"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.telefono}</div>
            )}
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Fecha de Nacimiento</label>
            {modoEdicion ? (
              <input
                type="text"
                value={datosUsuario.fechaNacimiento}
                onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                className="campo-input"
                placeholder="DD/MM/AA"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.fechaNacimiento}</div>
            )}
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Ciudad</label>
            {modoEdicion ? (
              <input
                type="text"
                value={datosUsuario.ciudad}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                className="campo-input"
              />
            ) : (
              <div className="campo-valor">{datosUsuario.ciudad}</div>
            )}
          </div>
        </div>

        <div className="perfil-acciones">
          {modoEdicion ? (
            <div className="acciones-edicion">
              <button className="btn-cancelar" onClick={handleCancelarEdicion}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleGuardarCambios}>
                Guardar Cambios
              </button>
            </div>
          ) : (
            <button className="btn-editar" onClick={handleActivarEdicion}>
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;