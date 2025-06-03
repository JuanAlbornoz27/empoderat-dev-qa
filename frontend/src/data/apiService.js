// Importar los datos mock
import { cursosData, usuarioData } from './mockData';

// URL base de tu API Spring Boot (para cuando esté disponible)
const API_URL = 'http://localhost:8080/api';

// Función auxiliar para simular un retardo de red
const simularRetardo = () => new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));

/* export const getCursos = async () => {
  try {
    // Petición GET usando fetch en lugar de axios
    const response = await fetch(`${API_URL}/cursos`);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
  }
}; */

export const getCourses = async () => {
  try {
    // Comenta esto mientras no exista el backend 
    /*
    const response = await fetch(`${API_URL}/cursos`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    */

    // Simulación temporal hasta que el backend esté listo
    await simularRetardo();
    console.log("Devolviendo datos simulados de cursos:", cursosData);
    return cursosData;

  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
  }
};

/* export const getUsuario = async (userId = null) => {
  try {
    // Endpoint: si hay userId, obtener un usuario específico
    // Si no, obtener el usuario autenticado actual
    const endpoint = userId ? `${API_URL}/usuarios/${userId}` : `${API_URL}/usuarios/perfil`;
    
    // Petición GET usando fetch
    const response = await fetch(endpoint, {
      // Incluir credenciales para enviar cookies de autenticación
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
}; */

export const getUsuario = async (userId = null) => {
  try {
    // Comenta esto mientras no exista el backend
    /*
    const endpoint = userId ? `${API_URL}/usuarios/${userId}` : `${API_URL}/usuarios/perfil`;
    
    const response = await fetch(endpoint, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    */

    // Simulación temporal hasta que el backend esté listo
    await simularRetardo();
    console.log("Devolviendo datos simulados de usuario:", usuarioData);
    return usuarioData;

  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};