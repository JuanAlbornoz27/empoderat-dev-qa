import React, { useState, useEffect } from 'react';
import Header from '../components/HeaderIndex';
import '../styles/ModuleManagementAll.css';
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

const ModuleManagement = () => {
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState(mockCourses);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Course search state
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    
    // Module search state
    const [moduleSearchTerm, setModuleSearchTerm] = useState('');

    // Update filtered courses when search term changes
    useEffect(() => {
        if (courseSearchTerm.trim() === '') {
            setFilteredCourses([]);
            setShowSuggestions(false);
        } else {
            const filtered = courses.filter(course =>
                course.title.toLowerCase().includes(courseSearchTerm.toLowerCase())
            );
            setFilteredCourses(filtered);
            setShowSuggestions(true);
        }
    }, [courseSearchTerm, courses]);

    // Load modules when course is selected or module search changes
    useEffect(() => {
        if (selectedCourse) {
            loadModules();
        }
    }, [selectedCourse, currentPage, moduleSearchTerm]);

    const loadModules = async () => {
        if (!selectedCourse) return;
        
        try {
            setLoading(true);
            setError(null);
            
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Filtrar módulos por curso seleccionado
            let courseModules = mockModules.filter(module => module.courseId === selectedCourse.id);
            
            // Aplicar filtro de búsqueda de módulos si existe
            if (moduleSearchTerm.trim() !== '') {
                courseModules = courseModules.filter(module =>
                    module.name.toLowerCase().includes(moduleSearchTerm.toLowerCase()) ||
                    module.description.toLowerCase().includes(moduleSearchTerm.toLowerCase())
                );
            }
            
            // Aplicar paginación
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedModules = courseModules.slice(startIndex, endIndex);
            
            setModules(paginatedModules);
            setTotalElements(courseModules.length);
            setTotalPages(Math.ceil(courseModules.length / pageSize));
            
        } catch (err) {
            setError('Error al cargar los módulos');
            console.error('Error loading modules:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setCourseSearchTerm(course.title);
        setShowSuggestions(false);
        setCurrentPage(1);
        setModuleSearchTerm('');
    };

    const handleCourseSearch = (e) => {
        setCourseSearchTerm(e.target.value);
    };

    const handleModuleSearch = (e) => {
        setModuleSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleStatusChange = async (moduleId, newStatus) => {
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Actualizar estado local
            setModules(prevModules =>
                prevModules.map(module =>
                    module.id === moduleId ? { ...module, status: newStatus } : module
                )
            );
        } catch (err) {
            setError('Error al actualizar el estado del módulo');
            console.error('Error updating module status:', err);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este módulo?')) {
            try {
                // Simular llamada a API
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Eliminar del estado local
                setModules(prevModules => prevModules.filter(module => module.id !== moduleId));
                
                // Recalcular paginación
                const newTotalElements = totalElements - 1;
                setTotalElements(newTotalElements);
                setTotalPages(Math.ceil(newTotalElements / pageSize));
                
                // Si estamos en la última página y se queda vacía, ir a la anterior
                if (modules.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                
            } catch (err) {
                setError('Error al eliminar el módulo');
                console.error('Error deleting module:', err);
            }
        }
    };

    const handleImageUpload = async (moduleId, file) => {
        try {
            // Simular upload de imagen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simular URL de imagen subida
            const mockImageUrl = `/uploads/${file.name}`;
            
            // Actualizar URL de imagen en el estado local
            setModules(prevModules =>
                prevModules.map(module =>
                    module.id === moduleId ? { ...module, imageUrl: mockImageUrl } : module
                )
            );
        } catch (err) {
            setError('Error al subir la imagen');
            console.error('Error uploading image:', err);
        }
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

    return (
        <div className="module-management">
            <Header isLoggedIn={true} isAdmin={true} />
            
            <main className="main-content">
                <section className="content-container">
                    <h1 className="page-title">Gestión de Módulos</h1>
                    <p className="page-subtitle">Seleccione el curso sobre el que desea trabajar</p>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Course Selection */}
                    <div className="course-selection">
                        <div className="course-search-container">
                            <input
                                type="text"
                                placeholder="Buscar curso"
                                value={courseSearchTerm}
                                onChange={handleCourseSearch}
                                className="course-search-input"
                                onFocus={() => courseSearchTerm && setShowSuggestions(true)}
                            />
                            <i className="fas fa-search search-icon" aria-hidden="true"></i>
                            
                            {showSuggestions && filteredCourses.length > 0 && (
                                <div className="suggestions-dropdown">
                                    {filteredCourses.map(course => (
                                        <div
                                            key={course.id}
                                            className="suggestion-item"
                                            onClick={() => handleCourseSelect(course)}
                                        >
                                            {course.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <button 
                            className="select-course-btn"
                            onClick={() => {
                                const course = courses.find(c => c.title.toLowerCase() === courseSearchTerm.toLowerCase());
                                if (course) {
                                    handleCourseSelect(course);
                                }
                            }}
                        >
                            Seleccionar
                        </button>
                    </div>

                    {/* Module Management Section - Only show when course is selected */}
                    {selectedCourse && (
                        <>
                            <div className="selected-course-info">
                                <h2>Módulos del curso: <strong>{selectedCourse.title}</strong></h2>
                            </div>

                            {/* Module Controls */}
                            <div className="controls">
                                <button className="add-module-btn" type="button">
                                    Añadir Módulo
                                </button>
                                
                                <div className="search-container">
                                    <input
                                        type="text"
                                        placeholder="Buscar módulo"
                                        value={moduleSearchTerm}
                                        onChange={handleModuleSearch}
                                        className="search-input"
                                    />
                                    <i className="fas fa-search search-icon" aria-hidden="true"></i>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Cargando módulos...</div>
                            ) : (
                                <>
                                    {/* Modules Table */}
                                    <div className="table-container">
                                        <table className="modules-table">
                                            <thead>
                                                <tr>
                                                    <th>Acción</th>
                                                    <th>Estado</th>
                                                    <th>Nombre</th>
                                                    <th>Descripción</th>
                                                    <th>Portada</th>
                                                    <th>Recursos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modules.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                                                            No se encontraron módulos para este curso
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    modules.map((module) => (
                                                        <tr key={module.id}>
                                                            <td className="actions-cell">
                                                                <button
                                                                    className="action-btn info-btn"
                                                                    aria-label={`Información módulo ${module.id}`}
                                                                    title="Ver información"
                                                                >
                                                                    <i className="fas fa-info"></i>
                                                                </button>
                                                                <button
                                                                    className="action-btn edit-btn"
                                                                    aria-label={`Editar módulo ${module.id}`}
                                                                    title="Editar módulo"
                                                                >
                                                                    <i className="fas fa-pencil-alt"></i>
                                                                </button>
                                                                <button
                                                                    className="action-btn hide-btn"
                                                                    aria-label={`Ocultar módulo ${module.id}`}
                                                                    title="Ocultar/Mostrar módulo"
                                                                    onClick={() => handleStatusChange(
                                                                        module.id, 
                                                                        module.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                                                    )}
                                                                >
                                                                    <i className={`fas ${module.status === 'ACTIVE' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                                </button>
                                                                <button
                                                                    className="action-btn delete-btn"
                                                                    aria-label={`Eliminar módulo ${module.id}`}
                                                                    title="Eliminar módulo"
                                                                    onClick={() => handleDeleteModule(module.id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <span className={`status-display ${module.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                                                    {module.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </td>
                                                            <td>{module.name}</td>
                                                            <td 
                                                                className="description-cell"
                                                                title={module.description}
                                                            >
                                                                {module.description.length > 50 
                                                                    ? `${module.description.substring(0, 50)}...` 
                                                                    : module.description
                                                                }
                                                            </td>
                                                            <td className="image-cell">
                                                                <div className="image-container">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="img.png"
                                                                        value={module.imageUrl || ''}
                                                                        readOnly
                                                                        className="image-input"
                                                                        aria-label={`Portada módulo ${module.id}`}
                                                                    />
                                                                    <label className="upload-btn" title="Subir imagen">
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={(e) => {
                                                                                if (e.target.files[0]) {
                                                                                    handleImageUpload(module.id, e.target.files[0]);
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
                                                                    href={`/admin/resources/module/${module.id}`}
                                                                    className="resources-link"
                                                                >
                                                                    Administrar recursos
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
                                </>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ModuleManagement;