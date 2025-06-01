import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/api';
import '../styles/ProfileLearner.css';
import Header from '../components/HeaderLearner';

const ProfileInfo = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Estado para manejar los datos del usuario
  const [usuario, setUsuario] = useState({
    nombre: user?.name || '',
    apellido: user?.lastName || '',
    email: user?.email || '',
    cedula: user?.documentNumber || '',
    telefono: user?.phone || '',
    fechaNacimiento: user?.birthDate || '',
    ciudad: user?.city || '',
    avatar: user?.imageUrl || null
  });
  
  // Cargar datos del perfil al iniciar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        if (response && response.data) {
          setUsuario({
            nombre: response.data.name || '',
            apellido: response.data.lastName || '',
            email: response.data.email || '',
            cedula: response.data.documentNumber || '',
            telefono: response.data.phone || '',
            fechaNacimiento: response.data.birthDate || '',
            ciudad: response.data.city || '',
            avatar: response.data.imageUrl || null
          });
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

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
  const handleGuardarCambios = async () => {
    try {
      setLoading(true);
      
      // Preparar datos para enviar al servidor
      const userData = {
        firstName: usuarioTemporal.nombre,
        lastName: usuarioTemporal.apellido,
        phone: usuarioTemporal.telefono,
        birthDate: usuarioTemporal.fechaNacimiento,
        city: usuarioTemporal.ciudad
      };
      
      // Enviar los datos al servidor
      const response = await userService.updateProfile(userData);
      
      // Actualizar el estado local con la respuesta
      if (response && response.data) {
        setUsuario({
          nombre: response.data.name || '',
          apellido: response.data.lastName || '',
          email: response.data.email || '',
          cedula: response.data.documentNumber || '',
          telefono: response.data.phone || '',
          fechaNacimiento: response.data.birthDate || '',
          ciudad: response.data.city || '',
          avatar: response.data.imageUrl || null
        });
        
      }
      
      setModoEdicion(false);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setUsuarioTemporal({ ...usuario });
    setModoEdicion(false);
  };

  // Función para activar el modo edición
  const handleActivarEdicion = () => {
    setUsuarioTemporal({ ...usuario });
    setModoEdicion(true);
  };

  // Función para manejar el cambio de avatar
  const handleCambioAvatar = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Mostrar una vista previa local inmediata
        const reader = new FileReader();
        reader.onload = (e) => {
          setUsuarioTemporal(prev => ({
            ...prev,
            avatar: e.target.result
          }));
        };
        reader.readAsDataURL(file);
        
        // Subir la imagen al servidor
        const formData = new FormData();
        formData.append('image', file);
        
        setLoading(true);
        const response = await userService.uploadProfileImage(formData);
        
        if (response && response.data) {
          // Actualizar con la URL real del servidor
          setUsuarioTemporal(prev => ({
            ...prev,
            avatar: response.data.imageUrl
          }));
          
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const datosUsuario = modoEdicion ? usuarioTemporal : usuario;

  return (
    <>
      <Header 
        texto1="Cursos" 
        texto2="Mis cursos" 
        texto3="Módulos" 
        texto4="Contáctanos" 
      />
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
    </>
  );
};

export default ProfileInfo;