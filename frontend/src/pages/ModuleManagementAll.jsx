import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/HeaderAdmin';
import '../styles/ModuleManagementAll.css';
// IMPORTAR LOS DATOS MOCK (solo como fallback)
import { mockCourses } from '../data/mockCourses';
import { mockModules } from '../data/mockModules';
import { moduleService, courseService } from '../services/api'; // Importar ambos servicios

// Asegurar que Font Awesome esté disponible
if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const ModuleManagement = () => {
    const navigate = useNavigate(); // Añadir esta línea
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]); // Iniciar como array vacío
    const [coursesLoading, setCoursesLoading] = useState(true); // Estado para carga de cursos
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Estados para edición
    const [editingModuleId, setEditingModuleId] = useState(null);
    const [editingModuleData, setEditingModuleData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        status: 'ACTIVE'
    });
    
    // Estado para añadir nuevo módulo
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [newModule, setNewModule] = useState({
        name: '',
        description: '',
        imageUrl: '',
        status: 'ACTIVE'
    });
    
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

    // Cargar cursos al iniciar el componente
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCoursesLoading(true);
                const response = await courseService.getAllCourses();
                
                // Asegurarse de que la respuesta tiene datos
                if (response && response.data) {
                    // Transformar los datos al formato esperado si es necesario
                    const formattedCourses = response.data.map(course => ({
                        id: course.id,
                        title: course.title || course.name, // Usar title o name según venga de la API
                        description: course.description,
                        image: course.imageUrl || course.image, // Usar la propiedad correcta para la imagen
                        status: course.status || 'ACTIVE'
                    }));
                    
                    setCourses(formattedCourses);
                    console.log('Cursos cargados desde API:', formattedCourses);
                } else {
                    throw new Error('No se recibieron datos de cursos');
                }
            } catch (error) {
                console.error('Error al cargar cursos:', error);
                // Fallback a datos mock en caso de error
                console.warn('Usando datos mock como fallback para cursos');
                setCourses(mockCourses);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);

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

    // Cargar módulos del curso seleccionado
    const loadModules = async () => {
        if (!selectedCourse) return;
        
        try {
            setLoading(true);
            setError(null);
            
            try {
                // Intentar obtener datos de la API
                const response = await moduleService.getModulesByCourse(selectedCourse.id);
                
                if (response && response.data) {
                    // Aplicar filtros localmente si es necesario
                    let filteredModules = response.data;
                    
                    if (moduleSearchTerm.trim() !== '') {
                        filteredModules = filteredModules.filter(module =>
                            module.name.toLowerCase().includes(moduleSearchTerm.toLowerCase()) ||
                            (module.description && module.description.toLowerCase().includes(moduleSearchTerm.toLowerCase()))
                        );
                    }
                    
                    // Aplicar paginación
                    const startIndex = (currentPage - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedModules = filteredModules.slice(startIndex, endIndex);
                    
                    setModules(paginatedModules);
                    setTotalElements(filteredModules.length);
                    setTotalPages(Math.ceil(filteredModules.length / pageSize));
                } else {
                    throw new Error('No se recibieron datos de la API');
                }
            } catch (apiError) {
                console.error('Error al cargar módulos desde la API:', apiError);
                console.warn('Usando datos mock como fallback debido a error de API');
                
                // Fallback a datos mock
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
            }
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

    // Handler para añadir nuevo módulo
    const handleAddModuleClick = () => {
        // Cancelar cualquier edición en curso primero
        if (editingModuleId !== null) {
            handleCancelEdit();
        }
        
        // Inicializar el nuevo módulo con valores por defecto
        setNewModule({
            name: '',
            description: '',
            status: 'ACTIVE',
            imageUrl: '',
            course: { id: selectedCourse.id }
        });
        
        // Activar el modo de adición
        setIsAddingModule(true);
        
        // Desplazar la vista al inicio de la tabla
        setTimeout(() => {
            const tableContainer = document.querySelector('.table-container');
            if (tableContainer) {
                tableContainer.scrollTop = 0;
            }
        }, 100);
    };
    
    // Modificar la función handleSaveNewModule para enviar el formato correcto de datos
    const handleSaveNewModule = async () => {
        try {
            // Validación básica
            if (!newModule.name || !newModule.description) {
                setError('Nombre y descripción son campos requeridos');
                setTimeout(() => setError(''), 3000);
                return;
            }
            
            // Preparar los datos en el formato que espera el backend
            const moduleData = {
                name: newModule.name,
                description: newModule.description,
                status: newModule.status,
                imageUrl: newModule.imageUrl || '',
                courseId: selectedCourse.id // Enviar solo el ID como campo directo, no como objeto anidado
            };
            
            console.log('Enviando datos de módulo:', moduleData);
            
            // Llamar al API para crear nuevo módulo
            const response = await moduleService.createModule(moduleData);
            
            console.log('Respuesta de creación de módulo:', response);
            
            // Actualizar el estado local con el nuevo módulo
            if (response && response.data) {
                const createdModule = response.data;
                
                // Añadir al inicio de la lista
                setModules(prevModules => [createdModule, ...prevModules]);
                
                // Incrementar contadores para paginación
                setTotalElements(prev => prev + 1);
                
                // Limpiar el estado de adición
                setIsAddingModule(false);
                setNewModule({
                    name: '',
                    description: '',
                    status: 'ACTIVE',
                    imageUrl: '',
                    course: { id: selectedCourse?.id }
                });
                
                // Mostrar mensaje de éxito
                setSuccess('Módulo creado correctamente');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error('No se recibió respuesta válida del servidor');
            }
        } catch (error) {
            setError('Error al crear el módulo: ' + (error.response?.data?.message || error.message));
            console.error('Error creating module:', error);
            setTimeout(() => setError(''), 5000);
        }
    };
    
    // Handler para cancelar nuevo módulo
    const handleCancelNewModule = () => {
        setIsAddingModule(false);
    };
    
    // Reemplazar la función handleEditModule por handleEditClick para mantener coherencia con el JSX
    const handleEditClick = (moduleId) => {
        // Si ya estamos editando o añadiendo, cancelar primero
        if (editingModuleId !== null || isAddingModule) {
            handleCancelEdit();
        }
        
        // Encontrar el módulo que queremos editar
        const moduleToEdit = modules.find(module => module.id === moduleId);
        if (moduleToEdit) {
            // Guardar una copia de los datos originales
            setEditingModuleData({
                name: moduleToEdit.name,
                description: moduleToEdit.description,
                status: moduleToEdit.status,
                imageUrl: moduleToEdit.imageUrl || ''
            });
            
            // Establecer el ID del módulo en edición
            setEditingModuleId(moduleId);
        }
    };

    // Renombrar handleSaveEditedModule a handleSaveEdit para mantener coherencia con el JSX
    const handleSaveEdit = async () => {
        try {
            if (!editingModuleData.name || !editingModuleData.description) {
                setError('Nombre y descripción son campos requeridos');
                setTimeout(() => setError(''), 3000);
                return;
            }
            
            // Crear objeto con datos actualizados en el formato correcto
            const updatedModuleData = {
                name: editingModuleData.name,
                description: editingModuleData.description,
                status: editingModuleData.status,
                imageUrl: editingModuleData.imageUrl || '',
                courseId: selectedCourse.id // ID directo, no objeto anidado
            };
            
            console.log('Enviando datos actualizados:', updatedModuleData);
            
            // Llamar al API para actualizar
            await moduleService.updateModule(editingModuleId, updatedModuleData);
            
            // Actualizar el estado local con los datos actualizados
            setModules(prevModules => 
                prevModules.map(module => 
                    module.id === editingModuleId 
                        ? { 
                            ...module, 
                            name: editingModuleData.name,
                            description: editingModuleData.description,
                            status: editingModuleData.status,
                            imageUrl: editingModuleData.imageUrl
                          } 
                        : module
                )
            );
            
            // Limpiar el estado de edición
            setEditingModuleId(null);
            setEditingModuleData({
                name: '',
                description: '',
                imageUrl: '',
                status: 'ACTIVE'
            });
            
            // Mostrar mensaje de éxito
            setSuccess('Módulo actualizado correctamente');
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (error) {
            setError('Error al guardar los cambios');
            console.error('Error saving module changes:', error);
            setTimeout(() => setError(''), 3000);
        }
    };
    
    // Handler para cancelar edición
    const handleCancelEdit = () => {
        // Si estamos editando un módulo
        if (editingModuleId !== null) {
            setEditingModuleId(null);
            setEditingModuleData({
                name: '',
                description: '',
                imageUrl: '',
                status: 'ACTIVE'
            });
        }
        
        // Si estamos añadiendo un módulo
        if (isAddingModule) {
            setIsAddingModule(false);
            setNewModule({
                name: '',
                description: '',
                status: 'ACTIVE',
                imageUrl: '',
                course: { id: selectedCourse?.id }
            });
        }
    };
    
    // Handler para actualizar estado
    const handleStatusChange = async (moduleId, newStatus) => {
        try {
            // Llamada a API para actualizar solo el estado
            await moduleService.updateModuleStatus(moduleId, newStatus);
            
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

    // Renombrar handleImageUpload a handleModuleImageUpload para mantener coherencia con el JSX
    const handleModuleImageUpload = async (moduleId, file) => {
        try {
            // Crear FormData para envío de archivos
            const formData = new FormData();
            formData.append('image', file);
            
            // Llamar al servicio para subir la imagen
            const response = await moduleService.uploadModuleImage(moduleId, formData);
            const imageUrl = response.data.imageUrl || `/uploads/${file.name}`;
            
            // Actualizar URL de imagen en el estado local
            setModules(prevModules =>
                prevModules.map(module =>
                    module.id === moduleId ? { ...module, imageUrl: imageUrl } : module
                )
            );
        } catch (err) {
            // Si falla la llamada API, simular upload con un URL local (solo para desarrollo)
            const mockImageUrl = `/uploads/${file.name}`;
            
            setModules(prevModules =>
                prevModules.map(module =>
                    module.id === moduleId ? { ...module, imageUrl: mockImageUrl } : module
                )
            );
            
            console.warn('Usando URL de imagen simulada debido a error de API');
            console.error('Error uploading image:', err);
        }
    };

    // Handler para actualizar datos del nuevo módulo mientras se edita
    const handleNewModuleChange = (field, value) => {
        setNewModule(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handler para actualizar datos de un módulo en edición
    const handleEditingModuleChange = (field, value) => {
        setEditingModuleData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handler para eliminar módulo
    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este módulo?')) {
            try {
                // Llamada a API
                await moduleService.deleteModule(moduleId);
                
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
            <Header
                    texto1="Categorías"
                    texto2="Cursos"
                    texto3="Módulos"
                    texto4="Estadísticas"

            isLoggedIn={true} isAdmin={true} />
            
            <main className="main-content">
                <section className="content-container">
                    <h1 className="page-title">Gestión de Módulos</h1>
                    <p className="page-subtitle">Seleccione el curso sobre el que desea trabajar</p>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="success-message" role="alert">
                            {success}
                        </div>
                    )}

                    {/* Course Selection - Mostrar indicador de carga si aún están cargando los cursos */}
                    {coursesLoading ? (
                        <div className="loading">Cargando cursos disponibles...</div>
                    ) : (
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
                    )}

                    {/* Module Management Section - Only show when course is selected */}
                    {selectedCourse && (
                        <>
                            <div className="selected-course-info">
                                <h2>Módulos del curso: <strong>{selectedCourse.title}</strong></h2>
                            </div>

                            {/* Module Controls */}
                            <div className="controls">
                                <button className="add-module-btn" type="button" onClick={handleAddModuleClick}>
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
                                                {/* Fila para añadir nuevo módulo - siempre al principio */}
                                                {isAddingModule && (
                                                    <tr className="new-module-row">
                                                        <td className="actions-cell">
                                                            <button 
                                                                className="action-btn save-btn"
                                                                aria-label="Guardar nuevo módulo"
                                                                title="Guardar módulo"
                                                                onClick={handleSaveNewModule}
                                                            >
                                                                <i className="fas fa-save"></i>
                                                            </button>
                                                            <button
                                                                className="action-btn cancel-btn"
                                                                aria-label="Cancelar nuevo módulo"
                                                                title="Cancelar"
                                                                onClick={handleCancelEdit}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={newModule.status}
                                                                onChange={(e) => handleNewModuleChange('status', e.target.value)}
                                                                className="status-select"
                                                            >
                                                                <option value="ACTIVE">Activo</option>
                                                                <option value="INACTIVE">Inactivo</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={newModule.name}
                                                                onChange={(e) => handleNewModuleChange('name', e.target.value)}
                                                                placeholder="Nombre del módulo"
                                                                className="edit-module-input"
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                value={newModule.description}
                                                                onChange={(e) => handleNewModuleChange('description', e.target.value)}
                                                                placeholder="Descripción del módulo"
                                                                className="edit-module-input description-input"
                                                            />
                                                        </td>
                                                        <td className="image-cell">
                                                            <div className="image-container">
                                                                <input
                                                                    type="text"
                                                                    placeholder="img.png"
                                                                    value={newModule.imageUrl || ''}
                                                                    className="image-input"
                                                                    readOnly
                                                                    aria-label="Portada nuevo módulo"
                                                                />
                                                                <label className="upload-btn" title="Subir imagen">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            if (e.target.files[0]) {
                                                                                const mockImageUrl = `/uploads/${e.target.files[0].name}`;
                                                                                handleNewModuleChange('imageUrl', mockImageUrl);
                                                                            }
                                                                        }}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                    <i className="fas fa-upload"></i>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="disabled-link">Disponible al guardar</span>
                                                        </td>
                                                    </tr>
                                                )}
                                                
                                                {/* Filas de módulos existentes */}
                                                {modules.length === 0 && !isAddingModule ? (
                                                    <tr>
                                                        <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                                                            {moduleSearchTerm ? 'No se encontraron módulos que coincidan con la búsqueda' : 'No se encontraron módulos para este curso'}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    modules.map((module) => (
                                                        <tr key={module.id}>
                                                            <td className="actions-cell">
                                                                {editingModuleId === module.id ? (
                                                                    <>
                                                                        <button 
                                                                            className="action-btn save-btn"
                                                                            aria-label={`Guardar módulo ${module.id}`}
                                                                            title="Guardar cambios"
                                                                            onClick={handleSaveEdit}
                                                                        >
                                                                            <i className="fas fa-save"></i>
                                                                        </button>
                                                                        <button
                                                                            className="action-btn cancel-btn"
                                                                            aria-label={`Cancelar edición módulo ${module.id}`}
                                                                            title="Cancelar edición"
                                                                            onClick={handleCancelEdit}
                                                                        >
                                                                            <i className="fas fa-times"></i>
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            className="action-btn edit-btn"
                                                                            aria-label={`Editar módulo ${module.id}`}
                                                                            title="Editar módulo"
                                                                            onClick={() => handleEditClick(module.id)}
                                                                        >
                                                                            <i className="fas fa-pencil-alt"></i>
                                                                        </button>
                                                                        <button
                                                                            className="action-btn delete-btn"
                                                                            aria-label={`Eliminar módulo ${module.id}`}
                                                                            title="Eliminar módulo"
                                                                            onClick={() => handleDeleteModule(module.id)}
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingModuleId === module.id ? (
                                                                    <select
                                                                        value={editingModuleData.status}
                                                                        onChange={(e) => handleEditingModuleChange('status', e.target.value)}
                                                                        className="status-select"
                                                                    >
                                                                        <option value="ACTIVE">Activo</option>
                                                                        <option value="INACTIVE">Inactivo</option>
                                                                    </select>
                                                                ) : (
                                                                    <span className={`status-display ${module.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                                                        {module.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingModuleId === module.id ? (
                                                                    <input
                                                                        type="text"
                                                                        className="edit-module-input"
                                                                        value={editingModuleData.name}
                                                                        onChange={(e) => handleEditingModuleChange('name', e.target.value)}
                                                                        aria-label="Nombre del módulo"
                                                                    />
                                                                ) : (
                                                                    module.name
                                                                )}
                                                            </td>
                                                            <td className="description-cell">
                                                                {editingModuleId === module.id ? (
                                                                    <textarea
                                                                        className="edit-module-input description-input"
                                                                        value={editingModuleData.description}
                                                                        onChange={(e) => handleEditingModuleChange('description', e.target.value)}
                                                                        aria-label="Descripción del módulo"
                                                                    />
                                                                ) : (
                                                                    <span title={module.description}>
                                                                        {module.description.length > 50 
                                                                            ? `${module.description.substring(0, 50)}...` 
                                                                            : module.description
                                                                        }
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="image-cell">
                                                                <div className="image-container">
                                                                    {editingModuleId === module.id ? (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="img.png"
                                                                                value={editingModuleData.imageUrl || ''}
                                                                                className="image-input"
                                                                                readOnly
                                                                                aria-label={`Portada módulo ${module.id}`}
                                                                            />
                                                                            <label className="upload-btn" title="Subir imagen">
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => {
                                                                                        if (e.target.files[0]) {
                                                                                            const mockImageUrl = `/uploads/${e.target.files[0].name}`;
                                                                                            handleEditingModuleChange('imageUrl', mockImageUrl);
                                                                                        }
                                                                                    }}
                                                                                    style={{ display: 'none' }}
                                                                                />
                                                                                <i className="fas fa-upload"></i>
                                                                            </label>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="img.png"
                                                                                value={module.imageUrl || ''}
                                                                                className="image-input"
                                                                                readOnly
                                                                                aria-label={`Portada módulo ${module.id}`}
                                                                            />
                                                                            <label className="upload-btn" title="Subir imagen">
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => {
                                                                                        if (e.target.files[0]) {
                                                                                            handleModuleImageUpload(module.id, e.target.files[0]);
                                                                                        }
                                                                                    }}
                                                                                    style={{ display: 'none' }}
                                                                                />
                                                                                <i className="fas fa-upload"></i>
                                                                            </label>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => navigate(`/admin/modulesManagement`, { state: { moduleId: module.id, moduleName: module.name } })}
                                                                    className="resources-link"
                                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                                                                >
                                                                    Administrar recursos
                                                                </button>
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