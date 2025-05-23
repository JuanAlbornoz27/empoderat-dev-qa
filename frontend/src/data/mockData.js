import cursoCrochet from "../assets/curso-crochet.png";
import cursoBordado from "../assets/curso-bordado.png";
import cursoCocina from "../assets/curso-cocina.png";
import profileIcon from "../assets/profileIcon.png";

export const cursosData = [
  {
    id: 1,
    nombre: "Curso de crochet",
    portada: cursoCrochet,
    duracion: 120,
    descripcion: "Aprende desde cero a manejar la máquina de coser, realizar puntadas básicas y confeccionar tus propias prendas y accesorios con técnicas prácticas y creativas.",
    modulos: [
      {
        id: 1,
        nombre: "PUNTADAS BÁSICAS",
        estado: "Finalizado",
        completado: true
      },
      {
        id: 2,
        nombre: "TEJIDO CIRCULAR",
        estado: "Pendiente",
        completado: false
      },
      {
        id: 3,
        nombre: "AMIGURUMI",
        estado: "Pendiente",
        completado: false
      }
    ]
  },
  {
    id: 2,
    nombre: "Curso de bordado",
    portada: cursoBordado,
    duracion: 120,
    descripcion: "Aprende desde cero a manejar la máquina de coser, realizar puntadas básicas y confeccionar tus propias prendas y accesorios con técnicas prácticas y creativas.",
    modulos: [
      {
        id: 1,
        nombre: "COCIDAS BÁSICAS",
        estado: "Finalizado",
        completado: true
      },
      {
        id: 2, 
        nombre: "PATRONES SIMPLES",
        estado: "Pendiente",
        completado: false
      }
    ]
  },
  {
    id: 3,
    nombre: "Curso de cocina",
    portada: cursoCocina,
    duracion: 120,
    descripcion: "Aprende desde cero a manejar la máquina de coser, realizar puntadas básicas y confeccionar tus propias prendas y accesorios con técnicas prácticas y creativas.",
    modulos: [
      {
        id: 1,
        nombre: "INTRODUCCIÓN A LA COCINA",
        estado: "Finalizado",
        completado: true
      },
      {
        id: 2,
        nombre: "PLATOS PRINCIPALES",
        estado: "Pendiente",
        completado: false
      }
    ]
  }
];

// Datos mock para el perfil de usuario
export const usuarioData = {
  id: 1,
  nombre: "Pepita",
  apellido: "Pérez",
  email: "Pepita.Perez@Gmail.com",
  cedula: "c.c. 1053789547",
  telefono: "3116789543",
  fechaNacimiento: "15/07/05",
  ciudad: "Tunja - Boyacá",
  avatar: profileIcon,
};
