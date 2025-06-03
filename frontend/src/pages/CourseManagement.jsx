import React, { useState, useEffect, useCallback } from 'react';
import { courseService, categoryService } from '../services/api';
import Header from '../components/HeaderAdmin';
import '../styles/CourseManagement.css';
// Mantener los mocks como fallback
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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Estado de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    // Estado de búsqueda y filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Estado para añadir y editar cursos
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [newCourseData, setNewCourseData] = useState({
        name: '',
        description: '',
        categoryId: '',
        status: 'ACTIVE',
        estimatedDuration: '10h',
        imageUrl: ''
    });

    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editingCourseData, setEditingCourseData] = useState({
        id: null,
        name: '',
        description: '',
        categoryId: '',
        status: 'ACTIVE',
        estimatedDuration: '',
        imageUrl: ''
    });

    // Cargar categorías al montar el componente
    useEffect(() => {
        const loadCategoriesAsync = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.data || []);
                if (response.data && response.data.length > 0) {
                    // Establecer categoría por defecto para nuevo curso si las categorías se cargan
                    setNewCourseData(prev => ({ ...prev, categoryId: response.data[0].id }));
                }
            } catch (err) {
                console.error('Error cargando categorías:', err);
                setError('Error al cargar categorías. Usando fallback.');
                const fallbackCategories = [
                    { id: 'cat1', name: 'Artes' },
                    { id: 'cat2', name: 'Cocina' },
                    { id: 'cat3', name: 'Comunicación' }
                ];
                setCategories(fallbackCategories);
                if (fallbackCategories.length > 0) {
                    setNewCourseData(prev => ({ ...prev, categoryId: fallbackCategories[0].id }));
                }
            }
        };
        loadCategoriesAsync();
    }, []);

    // Añadir en la parte superior del componente, justo después de declarar los estados
    useEffect(() => {
        // Extraer parámetros de la URL
        const queryParams = new URLSearchParams(window.location.search);
        const categoryParam = queryParams.get('category');

        // Si existe un parámetro de categoría, establecer el filtro
        if (categoryParam) {
            setCategoryFilter(categoryParam);
        }
    }, []);

    const getCategoryNameById = useCallback((categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    }, [categories]);

    // Cargar cursos cuando cambien los filtros o la paginación
    const loadCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage('');

            let response;
            if (searchTerm) {
                response = await courseService.searchCourses(searchTerm);
            } else if (categoryFilter !== 'all' && categories.length > 0) {
                const categoryObject = categories.find(cat => cat.name === categoryFilter || cat.id === categoryFilter);
                const categoryIdToFilter = categoryObject ? categoryObject.id : null;
                if (categoryIdToFilter) {
                    response = await courseService.getCoursesByCategory(categoryIdToFilter);
                } else {
                    response = await courseService.getAllCourses(); // Fallback si no se encuentra ID
                }
            }
            else {
                response = await courseService.getAllCourses();
            }

            if (response && response.data) {
                const formattedCourses = response.data.map(course => ({
                    id: course.id,
                    name: course.title || course.name,
                    status: course.status || 'ACTIVE',
                    description: course.description,
                    category: course.category?.name || getCategoryNameById(course.categoryId) || 'Sin categoría',
                    categoryNameDirect: course.category?.name,
                    enrolledCount: course.enrolledCount || 0,
                    estimatedDuration: `${course.estimatedDuration || 0}h`,
                    imageUrl: course.imageUrl || null,
                    moduleCount: course.moduleCount || 0,
                    activeModuleCount: course.activeModuleCount || 0
                }));

                let filteredCourses = formattedCourses;
                if (statusFilter !== 'all') {
                    filteredCourses = formattedCourses.filter(course => course.status === statusFilter);
                }

                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

                setCourses(paginatedCourses);
                setTotalElements(filteredCourses.length);
                setTotalPages(Math.ceil(filteredCourses.length / pageSize));
            } else {
                throw new Error("No se recibieron datos de cursos o la respuesta no tiene el formato esperado.");
            }
        } catch (err) {
            setError(`Error al cargar los cursos: ${err.message}. Usando datos mock.`);
            console.error('Error cargando cursos:', err);
            useMockData(); // Fallback a mock
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, statusFilter, categoryFilter, pageSize, categories, getCategoryNameById]);


    useEffect(() => {
        loadCourses();
    }, [loadCourses]); // Ahora loadCourses es una dependencia estable gracias a useCallback


    const useMockData = () => {
        const formattedMockCourses = mockCourses.map(course => {
            const courseModules = mockModules.filter(module => module.courseId === course.id);
            const activeModules = courseModules.filter(module => module.status === 'ACTIVE');
            const categoryName = getCategoryFromTitle(course.title);
            const categoryObject = categories.find(c => c.name === categoryName) || { id: categoryName, name: categoryName };


            return {
                id: course.id,
                name: course.title,
                status: 'ACTIVE',
                description: course.description,
                categoryId: categoryObject.id,
                category: categoryObject.name,
                enrolledCount: Math.floor(Math.random() * 30) + 5,
                estimatedDuration: `${Math.floor(Math.random() * 40) + 10}h`,
                imageUrl: course.image || null,
                moduleCount: courseModules.length,
                activeModuleCount: activeModules.length
            };
        });

        let filteredCourses = formattedMockCourses;
        if (searchTerm) {
            filteredCourses = filteredCourses.filter(course =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filteredCourses = filteredCourses.filter(course => course.status === statusFilter);
        }
        if (categoryFilter !== 'all') {
            const categoryObject = categories.find(cat => cat.name === categoryFilter || cat.id === categoryFilter);
            const categoryIdToFilter = categoryObject ? categoryObject.id : null;
            if (categoryIdToFilter) {
                filteredCourses = filteredCourses.filter(course => course.categoryId === categoryIdToFilter);
            }
        }

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

        setCourses(paginatedCourses);
        setTotalElements(filteredCourses.length);
        setTotalPages(Math.ceil(filteredCourses.length / pageSize));
    };

    const getCategoryFromTitle = (title) => {
        const title_lower = title.toLowerCase();
        if (title_lower.includes('crochet') || title_lower.includes('bordado') || title_lower.includes('artesanía')) return 'Artes';
        if (title_lower.includes('cocina')) return 'Cocina';
        if (title_lower.includes('comunicación')) return 'Comunicación';
        return categories.length > 0 ? categories[0].name : 'Artes';
    };

    const handleCancelEdit = () => {
        setIsAddingCourse(false);
        setEditingCourseId(null);
        setNewCourseData({
            name: '', description: '', categoryId: categories.length > 0 ? categories[0].id : '',
            status: 'ACTIVE', estimatedDuration: '10h', imageUrl: ''
        });
        setEditingCourseData({
            id: null, name: '', description: '', categoryId: '',
            status: 'ACTIVE', estimatedDuration: '', imageUrl: ''
        });
        setError(null);
        setSuccessMessage('');
    };

    const handleAddCourseClick = () => {
        handleCancelEdit(); // Cancela cualquier edición en curso
        setIsAddingCourse(true);
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) tableContainer.scrollTop = 0;
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'new') {
            setNewCourseData(prev => ({ ...prev, [name]: value }));
        } else if (formType === 'edit') {
            setEditingCourseData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveNewCourse = async () => {
        if (!newCourseData.name || !newCourseData.description || !newCourseData.categoryId) {
            setError('Nombre, descripción y categoría son requeridos.');
            setTimeout(() => setError(null), 3000);
            return;
        }
        try {
            const payload = {
                ...newCourseData,
                estimatedDuration: parseInt(newCourseData.estimatedDuration.replace('h', ''), 10) || 0,
            };
            const response = await courseService.createCourse(payload);
            if (response && response.data) {
                setSuccessMessage('Curso creado exitosamente!');
                loadCourses();
                handleCancelEdit();
            } else {
                throw new Error("La creación del curso no devolvió datos.");
            }
        } catch (err) {
            setError(`Error al crear el curso: ${err.response?.data?.message || err.message}`);
            console.error('Error creando curso:', err);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleEditCourseClick = (course) => {
        handleCancelEdit();
        setEditingCourseId(course.id);
        setEditingCourseData({
            id: course.id,
            name: course.name,
            description: course.description,
            categoryId: course.categoryId || (categories.find(c => c.name === course.category)?.id || ''),
            status: course.status,
            estimatedDuration: course.estimatedDuration,
            imageUrl: course.imageUrl || ''
        });
    };

    const handleSaveEditedCourse = async () => {
        if (!editingCourseData.name || !editingCourseData.description || !editingCourseData.categoryId) {
            setError('Nombre, descripción y categoría son requeridos.');
            setTimeout(() => setError(null), 3000);
            return;
        }
        try {
            const payload = {
                ...editingCourseData,
                estimatedDuration: parseInt(editingCourseData.estimatedDuration.replace('h', ''), 10) || 0,
            };
            const response = await courseService.updateCourse(editingCourseId, payload);
            if (response && response.data) {
                setSuccessMessage('Curso actualizado exitosamente!');
                loadCourses();
                handleCancelEdit();
            } else {
                throw new Error("La actualización del curso no devolvió datos.");
            }
        } catch (err) {
            setError(`Error al actualizar el curso: ${err.response?.data?.message || err.message}`);
            console.error('Error actualizando curso:', err);
            setTimeout(() => setError(null), 5000);
        }
    };

    // Manejador para cambiar la categoría de un curso
    const handleCategoryUpdate = async (courseId, newCategoryId) => {
        try {
            setSuccessMessage(''); setError(null);
            const categoryName = getCategoryNameById(newCategoryId);
            await courseService.updateCourse(courseId, { categoryId: newCategoryId });

            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId ? { ...course, category: categoryName, categoryId: newCategoryId } : course
                )
            );
            setSuccessMessage('Categoría del curso actualizada.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Error al actualizar la categoría del curso');
            console.error('Error actualizando categoría del curso:', err);
            setTimeout(() => setError(null), 3000);
        }
    };

    // Manejador para eliminar un curso
    const handleDeleteCourse = async (courseId) => {
        const course = courses.find(c => c.id === courseId);
        const hasModules = course.moduleCount > 0;

        let confirmMessage = '¿Está seguro de que desea eliminar este curso?';
        if (hasModules) {
            confirmMessage = `Este curso tiene ${course.moduleCount} módulo(s) asociado(s). ¿Está seguro de que desea eliminarlo? Esta acción también eliminará todos los módulos.`;
        }

        if (window.confirm(confirmMessage)) {
            try {
                setSuccessMessage('');
                setError(null);
                await courseService.deleteCourse(courseId);

                setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));

                const newTotalElements = totalElements - 1;
                setTotalElements(newTotalElements);
                setTotalPages(Math.ceil(newTotalElements / pageSize));

                if (courses.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else if (courses.length === 1 && currentPage === 1 && newTotalElements === 0) {
                    loadCourses();
                }

                setSuccessMessage('Curso eliminado exitosamente.');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError('Error al eliminar el curso: ' + (err.response?.data?.message || err.message));
                console.error('Error eliminando curso:', err);
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button key="1" onClick={() => setCurrentPage(1)} className="pagination-btn">1</button>
            );
            if (startPage > 2) {
                pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
            }
            pages.push(
                <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="pagination-btn">{totalPages}</button>
            );
        }
        return pages;
    };

    if (loading && !isAddingCourse && !editingCourseId) {
        return (
            <div className="course-management">
                <Header isLoggedIn={true} isAdmin={true} />
                <div className="loading">Cargando cursos...</div>
            </div>
        );
    }

    return (
        <div className="course-management">
            <Header
                texto1="Categorías"
                texto2="Cursos"
                texto3="Módulos"
                texto4="Estadísticas"

                isLoggedIn={true} isAdmin={true} />

            <main className="main-content">
                <section className="content-container">
                    <h1 className="page-title">Gestión de Cursos</h1>
                    <p className="page-subtitle">Una nueva puerta hacia el conocimiento</p>

                    {error && <div className="error-message" role="alert">{error}</div>}
                    {successMessage && <div className="success-message" role="alert">{successMessage}</div>}

                    <div className="controls">
                        <button className="add-course-btn" type="button" onClick={handleAddCourseClick} disabled={isAddingCourse || editingCourseId}>
                            Añadir Curso
                        </button>

                        <div className="search-container">
                            <input type="text" placeholder="Buscar Curso" value={searchTerm} onChange={handleSearch} className="search-input" />
                            <i className="fas fa-search search-icon"></i>
                        </div>

                        <div className="filter-controls">
                            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
                                <option value="all">Todos los estados</option>
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>

                            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="filter-select">
                                <option value="all">Todas las categorías</option>
                                {categories.map(category => (
                                    <option key={category.id || category.name} value={category.id || category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

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
                                    <th>Duración</th>
                                    <th>Portada (URL)</th>
                                    <th>Módulos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isAddingCourse && (
                                    <tr className="new-course-row">
                                        <td className="actions-cell">
                                            <button className="action-btn save-btn" title="Guardar Nuevo Curso" onClick={handleSaveNewCourse}><i className="fas fa-save"></i></button>
                                            <button className="action-btn cancel-btn" title="Cancelar" onClick={handleCancelEdit}><i className="fas fa-times"></i></button>
                                        </td>
                                        <td>NUEVO</td>
                                        <td><input type="text" name="name" value={newCourseData.name} onChange={(e) => handleInputChange(e, 'new')} placeholder="Nombre del curso" className="edit-input" /></td>
                                        <td>
                                            <select name="status" value={newCourseData.status} onChange={(e) => handleInputChange(e, 'new')} className="edit-select">
                                                <option value="ACTIVE">Activo</option>
                                                <option value="INACTIVE">Inactivo</option>
                                            </select>
                                        </td>
                                        <td><textarea name="description" value={newCourseData.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Descripción" className="edit-textarea" /></td>
                                        <td>
                                            {editingCourseId === course.id ? (
                                                <select
                                                    name="categoryId"
                                                    value={editingCourseData.categoryId}
                                                    onChange={(e) => handleInputChange(e, 'edit')}
                                                    className="edit-select"
                                                >
                                                    <option value="">Seleccione categoría</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="category-display">
                                                    {/* Use the direct name if available; otherwise, try lookup or show 'Sin categoría' */}
                                                    {course.categoryNameDirect || (course.categoryId ? getCategoryNameById(course.categoryId) : 'Sin categoría')}
                                                </span>
                                            )}
                                        </td>
                                        <td><span className="text-center">-</span></td> {/* Inscritos no editable al crear */}
                                        <td><input type="text" name="estimatedDuration" value={newCourseData.estimatedDuration} onChange={(e) => handleInputChange(e, 'new')} placeholder="Ej: 20h" className="edit-input short-input" /></td>
                                        <td><input type="text" name="imageUrl" value={newCourseData.imageUrl} onChange={(e) => handleInputChange(e, 'new')} placeholder="URL de imagen" className="edit-input" /></td>
                                        <td><span className="text-center">-</span></td> {/* Módulos no gestionables al crear */}
                                    </tr>
                                )}

                                {courses.length === 0 && !isAddingCourse ? (
                                    <tr><td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron cursos</td></tr>
                                ) : (
                                    courses.map((course) => (
                                        editingCourseId === course.id ? (
                                            <tr key={course.id} className="editing-course-row">
                                                <td className="actions-cell">
                                                    <button className="action-btn save-btn" title="Guardar Cambios" onClick={handleSaveEditedCourse}><i className="fas fa-save"></i></button>
                                                    <button className="action-btn cancel-btn" title="Cancelar Edición" onClick={handleCancelEdit}><i className="fas fa-times"></i></button>
                                                </td>
                                                <td>{course.id}</td>
                                                <td><input type="text" name="name" value={editingCourseData.name} onChange={(e) => handleInputChange(e, 'edit')} className="edit-input" /></td>
                                                <td>
                                                    <select name="status" value={editingCourseData.status} onChange={(e) => handleInputChange(e, 'edit')} className="edit-select">
                                                        <option value="ACTIVE">Activo</option>
                                                        <option value="INACTIVE">Inactivo</option>
                                                    </select>
                                                </td>
                                                <td><textarea name="description" value={editingCourseData.description} onChange={(e) => handleInputChange(e, 'edit')} className="edit-textarea" /></td>
                                                <td>
                                                    <select name="categoryId" value={editingCourseData.categoryId} onChange={(e) => handleInputChange(e, 'edit')} className="edit-select">
                                                        <option value="">Seleccione categoría</option>
                                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className="text-center">{course.enrolledCount}</td>
                                                <td><input type="text" name="estimatedDuration" value={editingCourseData.estimatedDuration} onChange={(e) => handleInputChange(e, 'edit')} className="edit-input short-input" /></td>
                                                <td>
                                                    <div className="image-container">
                                                        <input type="text" name="imageUrl" value={editingCourseData.imageUrl} onChange={(e) => handleInputChange(e, 'edit')} placeholder="URL de imagen" className="edit-input" />
                                                        {/* Opcional: Botón de subida aquí también, pero más complejo */}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <a href={`/admin/modules/course/${course.id}`} className="modules-link">Ver ({course.moduleCount || 0})</a>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={course.id}>
                                                <td className="actions-cell">
                                                    {/* <button className="action-btn info-btn" title="Ver información"><i className="fas fa-info"></i></button> */}
                                                    <button className="action-btn edit-btn" title="Editar curso" onClick={() => handleEditCourseClick(course)} disabled={isAddingCourse || editingCourseId}><i className="fas fa-pencil-alt"></i></button>
                                                    <button className="action-btn " title="Eliminar curso" onClick={() => handleDeleteCourse(course.id)} disabled={isAddingCourse || editingCourseId}><i className="fas fa-trash"></i></button>
                                                </td>
                                                <td>{course.id}</td>
                                                <td>{course.name}</td>
                                                <td><span className={`status-display ${course.status === 'ACTIVE' ? 'active' : 'inactive'}`}>{course.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</span></td>
                                                <td className="description-cell" title={course.description}>{course.description.length > 50 ? `${course.description.substring(0, 50)}...` : course.description}</td>
                                                <td>
                                                    {/* Para cambio rápido de categoría sin entrar a editar (opcional) */}
                                                    {/* <select value={course.categoryId || ''} 
                                                            onChange={(e) => handleCategoryUpdate(course.id, e.target.value)}
                                                            className="quick-category-select"
                                                            disabled={isAddingCourse || editingCourseId}>
                                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                    </select> */}
                                                    <span className="category-display">{getCategoryNameById(course.categoryId) || course.category}</span>

                                                </td>
                                                <td className="text-center">{course.enrolledCount}</td>
                                                <td className="text-center">{course.estimatedDuration}</td>
                                                <td className="image-cell">
                                                    <div className="image-container">
                                                        <input type="text" placeholder="img.png" value={course.imageUrl || ''} readOnly className="image-input" />
                                                        <label className="upload-btn" title="Subir imagen">
                                                            <input type="file" accept="image/*" style={{ display: 'none' }}
                                                                onChange={(e) => { if (e.target.files[0]) { handleImageUpload(course.id, e.target.files[0]); } }}
                                                                disabled={isAddingCourse || editingCourseId}
                                                            />
                                                            <i className="fas fa-upload"></i>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <a href={`/admin/modules/course/${course.id}`} className="modules-link">Administrar ({course.moduleCount || 0})</a>
                                                </td>
                                            </tr>
                                        )
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-container">
                        <div className="pagination">
                            <span>Página</span>
                            {renderPagination()}
                        </div>
                        <div className="results-info">
                            Resultado {totalElements > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} a {Math.min(currentPage * pageSize, totalElements)} de {totalElements}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CourseManagement;