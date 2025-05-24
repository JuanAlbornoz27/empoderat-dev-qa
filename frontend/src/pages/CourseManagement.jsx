import React, { useState, useEffect } from 'react';
import { courseService, categoryService } from '../services/api';
import Header from '../components/HeaderIndex';
import '../styles/CourseManagement.css';
// IMPORTAR LOS DATOS MOCK
import { mockCourses } from '../data/mockCourses';
import { mockModules } from '../data/mockModules';

// Asegurar que Font Awesome esté disponible
if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState(['Artes', 'Cocina', 'Comunicación']); // Categorías basadas en los mocks
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Load courses on component mount and when filters change
    useEffect(() => {
        loadCourses();
    }, [currentPage, searchTerm, statusFilter, categoryFilter]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Convertir mockCourses al formato esperado por la tabla
            const formattedCourses = mockCourses.map(course => {
                // Contar módulos activos para cada curso
                const courseModules = mockModules.filter(module => module.courseId === course.id);
                const activeModules = courseModules.filter(module => module.status === 'ACTIVE');
                
                return {
                    id: course.id,
                    name: course.title,
                    status: 'ACTIVE', // Por defecto todos activos
                    description: course.description,
                    category: getCategoryFromTitle(course.title),
                    enrolledCount: Math.floor(Math.random() * 30) + 5, // Número aleatorio para simular inscritos
                    estimatedDuration: `${Math.floor(Math.random() * 40) + 10}h`, // Duración aleatoria
                    imageUrl: course.image || null,
                    moduleCount: courseModules.length,
                    activeModuleCount: activeModules.length
                };
            });
            
            // Aplicar filtros si existen
            let filteredCourses = formattedCourses;
            
            if (searchTerm) {
                filteredCourses = formattedCourses.filter(course =>
                    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (statusFilter !== 'all') {
                filteredCourses = filteredCourses.filter(course => course.status === statusFilter);
            }
            
            if (categoryFilter !== 'all') {
                filteredCourses = filteredCourses.filter(course => course.category === categoryFilter);
            }
            
            // Aplicar paginación
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
            
            setCourses(paginatedCourses);
            setTotalElements(filteredCourses.length);
            setTotalPages(Math.ceil(filteredCourses.length / pageSize));
            
        } catch (err) {
            setError('Error al cargar los cursos');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para determinar categoría basada en el título
    const getCategoryFromTitle = (title) => {
        const title_lower = title.toLowerCase();
        if (title_lower.includes('crochet') || title_lower.includes('bordado') || title_lower.includes('artesanía')) {
            return 'Artes';
        } else if (title_lower.includes('cocina')) {
            return 'Cocina';
        } else if (title_lower.includes('comunicación')) {
            return 'Comunicación';
        }
        return 'Artes'; // Por defecto
    };

    const handleStatusChange = async (courseId, newStatus) => {
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Actualizar estado local (en un entorno real esto vendría del backend)
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId ? { ...course, status: newStatus } : course
                )
            );
        } catch (err) {
            setError('Error al actualizar el estado del curso');
            console.error('Error updating course status:', err);
        }
    };

    const handleCategoryChange = async (courseId, newCategory) => {
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Actualizar categoría local
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId ? { ...course, category: newCategory } : course
                )
            );
        } catch (err) {
            setError('Error al actualizar la categoría del curso');
            console.error('Error updating course category:', err);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este curso?')) {
            try {
                // Simular llamada a API
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Eliminar del estado local
                setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
                
                // Recalcular paginación
                const newTotalElements = totalElements - 1;
                setTotalElements(newTotalElements);
                setTotalPages(Math.ceil(newTotalElements / pageSize));
                
                // Si estamos en la última página y se queda vacía, ir a la anterior
                if (courses.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                
            } catch (err) {
                setError('Error al eliminar el curso');
                console.error('Error deleting course:', err);
            }
        }
    };

    const handleImageUpload = async (courseId, file) => {
        try {
            // Simular upload de imagen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simular URL de imagen subida
            const mockImageUrl = `/uploads/${file.name}`;
            
            // Actualizar URL de imagen en el estado local
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId ? { ...course, imageUrl: mockImageUrl } : course
                )
            );
        } catch (err) {
            setError('Error al subir la imagen');
            console.error('Error uploading image:', err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        for (let i = 1; i <= Math.min(totalPages, maxVisiblePages); i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                    aria-label={`Página ${i}`}
                    aria-current={currentPage === i ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }
        
        return pages;
    };

    if (loading) {
        return (
            <div className="course-management">
                <Header isLoggedIn={true} isAdmin={true} />
                <div className="loading">Cargando cursos...</div>
            </div>
        );
    }

    return (
        <div className="course-management">
            <Header isLoggedIn={true} isAdmin={true} />
            
            <main className="main-content">
                <section className="content-container">
                    <h1 className="page-title">Gestión de Cursos</h1>
                    <p className="page-subtitle">Una nueva puerta hacia el conocimiento</p>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="controls">
                        <button className="add-course-btn" type="button">
                            Añadir Curso
                        </button>
                        
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar Curso"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon" aria-hidden="true"></i>
                        </div>
                        
                        <div className="filter-controls">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="filter-select"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                            
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="filter-select"
                            >
                                <option value="all">Todas las categorías</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="courses-table">
                            <thead>
                                <tr>
                                    <th>Acción</th>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Descripción</th>
                                    <th>Categoría</th>
                                    <th>Inscritos</th>
                                    <th>Duración Estimada</th>
                                    <th>Portada</th>
                                    <th>Módulos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" style={{textAlign: 'center', padding: '2rem'}}>
                                            No se encontraron cursos
                                        </td>
                                    </tr>
                                ) : (
                                    courses.map((course) => (
                                        <tr key={course.id}>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-btn info-btn"
                                                    aria-label={`Información curso ${course.id}`}
                                                    title="Ver información"
                                                >
                                                    <i className="fas fa-info"></i>
                                                </button>
                                                <button
                                                    className="action-btn edit-btn"
                                                    aria-label={`Editar curso ${course.id}`}
                                                    title="Editar curso"
                                                >
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button
                                                    className="action-btn hide-btn"
                                                    aria-label={`Ocultar curso ${course.id}`}
                                                    title="Ocultar/Mostrar curso"
                                                    onClick={() => handleStatusChange(
                                                        course.id, 
                                                        course.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                                    )}
                                                >
                                                    <i className={`fas ${course.status === 'ACTIVE' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                </button>
                                                <button
                                                    className="action-btn delete-btn"
                                                    aria-label={`Eliminar curso ${course.id}`}
                                                    title="Eliminar curso"
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                            <td>{course.id}</td>
                                            <td>{course.name}</td>
                                            <td>
                                                <span className={`status-display ${course.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                                    {course.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td 
                                                className="description-cell"
                                                title={course.description}
                                            >
                                                {course.description.length > 50 
                                                    ? `${course.description.substring(0, 50)}...` 
                                                    : course.description
                                                }
                                            </td>
                                            <td>
                                                <span className="category-display">
                                                    {course.category}
                                                </span>
                                            </td>
                                            <td className="text-center">{course.enrolledCount || 0}</td>
                                            <td className="text-center">{course.estimatedDuration || 'N/A'}</td>
                                            <td className="image-cell">
                                                <div className="image-container">
                                                    <input
                                                        type="text"
                                                        placeholder="img.png"
                                                        value={course.imageUrl || ''}
                                                        readOnly
                                                        className="image-input"
                                                        aria-label={`Portada curso ${course.id}`}
                                                    />
                                                    <label className="upload-btn" title="Subir imagen">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                if (e.target.files[0]) {
                                                                    handleImageUpload(course.id, e.target.files[0]);
                                                                }
                                                            }}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <i className="fas fa-upload"></i>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <a
                                                    href={`/admin/modules/course/${course.id}`}
                                                    className="modules-link"
                                                >
                                                    Administrar módulos ({course.moduleCount || 0})
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-container" aria-label="Paginación y resultados">
                        <div className="pagination">
                            <span>Página</span>
                            {renderPagination()}
                            {totalPages > 5 && (
                                <>
                                    <i className="fas fa-angle-right pagination-arrow"></i>
                                    <i className="fas fa-angle-right pagination-arrow"></i>
                                </>
                            )}
                        </div>
                        <div className="results-info">
                            Resultado {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalElements)} de {totalElements}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CourseManagement;