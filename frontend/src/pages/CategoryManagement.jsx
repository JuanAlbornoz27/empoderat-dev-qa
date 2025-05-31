import React, { useState, useEffect, useMemo } from 'react';
import { mockCategories } from '../data/mockCategories';
import '../styles/CategoryManagement.css';
import Header from "../components/HeaderAdmin";
import { categoryService } from "../services/api";

// Asegurar que Font Awesome esté disponible
if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const CategoryManagement = () => {
    // Estado principal de datos
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados de UI
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });

    // Estados para edición de categorías
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryData, setEditingCategoryData] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });

    // Cargar datos iniciales solo una vez
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            try {
                const response = await categoryService.getAllCategories();
                
                if (response && response.data) {
                    // Transformar los datos si es necesario para asegurar compatibilidad
                    const transformedCategories = response.data.map(category => ({
                        id: category.id,
                        name: category.name,
                        description: category.description || '',
                        courseCount: category.courseCount || category.courses?.length || 0,
                        imageUrl: category.imageUrl || null
                    }));
                    
                    setAllCategories(transformedCategories);
                    console.log('Categorías cargadas desde API:', transformedCategories);
                } else {
                    throw new Error('No se recibieron datos');
                }
            } catch (apiError) {
                console.error('Error al obtener categorías de la API:', apiError);
                // En caso de error, usar datos mock como fallback
                console.warn('Usando datos mock como fallback debido a error de API');
                setAllCategories(mockCategories);
            }
            
        } catch (err) {
            setError('Error al cargar las categorías');
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar categorías en tiempo real usando useMemo
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) {
            return allCategories;
        }
        
        return allCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allCategories, searchTerm]);

    // Calcular paginación basada en categorías filtradas
    const paginationData = useMemo(() => {
        const totalElements = filteredCategories.length;
        const totalPages = Math.ceil(totalElements / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
        
        return {
            categories: paginatedCategories,
            totalElements,
            totalPages,
            startIndex,
            endIndex
        };
    }, [filteredCategories, currentPage, pageSize]);

    // Resetear página cuando se busca
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
            try {
                // Llamada real a la API
                await categoryService.deleteCategory(categoryId);
                
                // Eliminar de todos los datos
                setAllCategories(prevCategories => 
                    prevCategories.filter(category => category.id !== categoryId)
                );
                
                // Si la página actual queda vacía después de eliminar, ir a la anterior
                const newFilteredCount = filteredCategories.length - 1;
                const newTotalPages = Math.ceil(newFilteredCount / pageSize);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
                
            } catch (err) {
                setError('Error al eliminar la categoría');
                console.error('Error deleting category:', err);
            }
        }
    };

    const handleImageUpload = async (categoryId, file) => {
        try {
            // Simular upload de imagen (sin delay largo)
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Simular URL de imagen subida
            const mockImageUrl = `/uploads/${file.name}`;
            
            // Actualizar URL de imagen en todos los datos
            setAllCategories(prevCategories =>
                prevCategories.map(category =>
                    category.id === categoryId ? { ...category, imageUrl: mockImageUrl } : category
                )
            );
        } catch (err) {
            setError('Error al subir la imagen');
            console.error('Error uploading image:', err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    //Handle para añadir una nueva categoría
    const handleAddCategoryClick = () => {
        setIsAddingCategory(true);
        setNewCategory({
            name: '',
            description: '',
            imageUrl: ''
        });
    };

    const handleNewCategoryChange = (field, value) => {
        setNewCategory(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveNewCategory = async () => {
        try {
            // Validar datos
            if (!newCategory.name.trim()) {
                alert('El nombre de la categoría es obligatorio');
                return;
            }
            
            // Crear el objeto JSON simplificado para enviar a la API
            const categoryJson = {
                name: newCategory.name,
                description: newCategory.description,
                imageUrl: newCategory.imageUrl
            };
            
            console.log('Enviando a API:', categoryJson);
            
            // Aquí iría la llamada a la API para guardar la categoría
            try {
                const response = await categoryService.createCategory(categoryJson);
                
                // Si la llamada es exitosa, actualizar con los datos de la respuesta
                if (response && response.data) {
                    const savedCategory = {
                        id: response.data.id,
                        name: response.data.name,
                        description: response.data.description || '',
                        courseCount: 0,
                        imageUrl: response.data.imageUrl || ''
                    };
                    
                    // Actualizar el estado local con la respuesta del servidor
                    setAllCategories(prev => [...prev, savedCategory]);
                } else {
                    // Continuar con la lógica existente (crear localmente si la API falla)
                    const nextId = allCategories.length > 0 
                        ? Math.max(...allCategories.map(cat => parseInt(cat.id))) + 1 
                        : 1;
                        
                    const categoryToSave = {
                        ...newCategory,
                        id: nextId.toString(),
                        courseCount: 0
                    };
                    
                    // Actualizar el estado local
                    setAllCategories(prev => [...prev, categoryToSave]);
                }
                
                // Reiniciar el estado de añadir
                setIsAddingCategory(false);
                setNewCategory({ name: '', description: '', imageUrl: '' });
                
            } catch (err) {
                setError('Error al guardar la categoría');
                console.error('Error saving category:', err);
            }
        } catch (err) {
            setError('Error al guardar la categoría');
            console.error('Error saving category:', err);
        }
    };

    const handleCancelNewCategory = () => {
        setIsAddingCategory(false);
    };

    // Añadir después de handleCancelNewCategory
    const handleEditCategory = (category) => {
        // Iniciar la edición con los datos actuales de la categoría
        setEditingCategoryId(category.id);
        setEditingCategoryData({
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl || ''
        });
    };

    const handleEditingCategoryChange = (field, value) => {
        setEditingCategoryData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEditedCategory = async () => {
        // Validar datos
        if (!editingCategoryData.name.trim()) {
            alert('El nombre de la categoría es obligatorio');
            return;
        }
        
        try {
            // Crear el objeto JSON simplificado para enviar a la API
            const categoryJson = {
                name: editingCategoryData.name,
                description: editingCategoryData.description,
                imageUrl: editingCategoryData.imageUrl
            };
            
            console.log('Enviando a API datos editados:', categoryJson);
            
            // Llamada a la API para actualizar la categoría
            const response = await categoryService.updateCategory(editingCategoryId, categoryJson);
            
            // Si la llamada es exitosa, actualizar el estado local
            if (response && response.data) {
                const updatedCategory = {
                    id: editingCategoryId,
                    name: response.data.name,
                    description: response.data.description || '',
                    imageUrl: response.data.imageUrl || '',
                    // Conservar el courseCount existente
                    courseCount: allCategories.find(c => c.id === editingCategoryId)?.courseCount || 0
                };
                
                // Actualizar el estado local con la respuesta del servidor
                setAllCategories(prevCategories =>
                    prevCategories.map(category =>
                        category.id === editingCategoryId ? updatedCategory : category
                    )
                );
            } else {
                // Fallback: actualizar solo con los datos locales si la API no devuelve datos
                setAllCategories(prevCategories =>
                    prevCategories.map(category =>
                        category.id === editingCategoryId
                            ? { ...category, ...editingCategoryData }
                            : category
                    )
                );
            }
            
            // Salir del modo edición
            setEditingCategoryId(null);
        } catch (err) {
            setError('Error al actualizar la categoría');
            console.error('Error updating category:', err);
        }
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
    };

    const renderPagination = () => {
        const { totalPages } = paginationData;
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
            <div className="category-management">
                <Header isLoggedIn={true} isAdmin={true} />
                <div className="loading">Cargando categorías...</div>
            </div>
        );
    }

    const { categories, totalElements, totalPages, startIndex } = paginationData;

    return (
        <div className="category-management">
            {/* <Header isLoggedIn={true} isAdmin={true} /> */}
            
            <main className="main-content">
                <section className="content-container">
                    <Header
                        texto1="Categorías"
                        texto2="Cursos"
                        texto3="Módulos"
                        texto4="Contáctanos"
                    />
                    <h1 className="page-title">Gestión de Categorías</h1>
                    <p className="page-subtitle">Una forma sencilla de organizar sus ideas</p>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="controls">
                        {/* Actualiza el botón existente añadiendo el onClick */}
                        <button className="add-category-btn" type="button" onClick={handleAddCategoryClick}>
                            Añadir Categoría
                        </button>
                        
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar Categoría"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon" aria-hidden="true"></i>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="categories-table">
                            <thead>
                                <tr>
                                    <th>Acción</th>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Cantidad de cursos</th>
                                    <th>Portada</th>
                                    <th>Cursos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>
                                            {searchTerm ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No se encontraron categorías'}
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="actions-cell">
                                                {editingCategoryId === category.id ? (
                                                    <>
                                                        <button
                                                            className="action-btn save-btn"
                                                            aria-label="Guardar categoría"
                                                            title="Guardar cambios"
                                                            onClick={handleSaveEditedCategory}
                                                        >
                                                            <i className="fas fa-save"></i>
                                                        </button>
                                                        <button
                                                            className="action-btn cancel-btn"
                                                            aria-label="Cancelar edición"
                                                            title="Cancelar"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="action-btn edit-btn"
                                                            aria-label={`Editar categoría ${category.id}`}
                                                            title="Editar categoría"
                                                            onClick={() => handleEditCategory(category)}
                                                        >
                                                            <i className="fas fa-pencil-alt"></i>
                                                        </button>
                                                        <button
                                                            className="action-btn delete-btn"
                                                            aria-label={`Eliminar categoría ${category.id}`}
                                                            title="Eliminar categoría"
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                            <td>{category.id}</td>
                                            <td>
                                                {editingCategoryId === category.id ? (
                                                    <input
                                                        type="text"
                                                        className="new-category-input"
                                                        value={editingCategoryData.name}
                                                        onChange={(e) => handleEditingCategoryChange('name', e.target.value)}
                                                        aria-label="Nombre de la categoría"
                                                    />
                                                ) : (
                                                    category.name
                                                )}
                                            </td>
                                            <td className="description-cell">
                                                {editingCategoryId === category.id ? (
                                                    <textarea
                                                        className="new-category-input description-input"
                                                        value={editingCategoryData.description}
                                                        onChange={(e) => handleEditingCategoryChange('description', e.target.value)}
                                                        aria-label="Descripción de la categoría"
                                                    />
                                                ) : (
                                                    <span title={category.description}>
                                                        {category.description.length > 50 
                                                            ? `${category.description.substring(0, 50)}...` 
                                                            : category.description
                                                        }
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-center">{category.courseCount || 0}</td>
                                            <td className="image-cell">
                                                <div className="image-container">
                                                    <input
                                                        type="text"
                                                        placeholder="img.png"
                                                        value={editingCategoryId === category.id 
                                                            ? editingCategoryData.imageUrl || '' 
                                                            : category.imageUrl || ''}
                                                        readOnly={editingCategoryId !== category.id}
                                                        className="image-input"
                                                        onChange={editingCategoryId === category.id 
                                                            ? (e) => handleEditingCategoryChange('imageUrl', e.target.value) 
                                                            : undefined}
                                                        aria-label={`Portada categoría ${category.id}`}
                                                    />
                                                    <label className="upload-btn" title="Subir imagen">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                if (e.target.files[0]) {
                                                                    if (editingCategoryId === category.id) {
                                                                        const mockImageUrl = `/uploads/${e.target.files[0].name}`;
                                                                        handleEditingCategoryChange('imageUrl', mockImageUrl);
                                                                    } else {
                                                                        handleImageUpload(category.id, e.target.files[0]);
                                                                    }
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
                                                    href={`/admin/courses/category/${category.id}`}
                                                    className="courses-link"
                                                >
                                                    Administrar cursos
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {isAddingCategory && (
                                    <tr className="new-category-row">
                                        <td className="actions-cell">
                                            <button
                                                className="action-btn save-btn"
                                                aria-label="Guardar nueva categoría"
                                                title="Guardar categoría"
                                                onClick={handleSaveNewCategory}
                                            >
                                                <i className="fas fa-save"></i>
                                            </button>
                                            <button
                                                className="action-btn cancel-btn"
                                                aria-label="Cancelar nueva categoría"
                                                title="Cancelar"
                                                onClick={handleCancelNewCategory}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <span className="new-id">
                                                {allCategories.length > 0 
                                                    ? Math.max(...allCategories.map(cat => parseInt(cat.id))) + 1 
                                                    : 1}
                                            </span>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="new-category-input"
                                                placeholder="Nombre de la categoría"
                                                value={newCategory.name}
                                                onChange={(e) => handleNewCategoryChange('name', e.target.value)}
                                                aria-label="Nombre de la categoría"
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                className="new-category-input description-input"
                                                placeholder="Descripción de la categoría"
                                                value={newCategory.description}
                                                onChange={(e) => handleNewCategoryChange('description', e.target.value)}
                                                aria-label="Descripción de la categoría"
                                            />
                                        </td>
                                        <td className="text-center">0</td>
                                        <td className="image-cell">
                                            <div className="image-container">
                                                <input
                                                    type="text"
                                                    placeholder="img.png"
                                                    value={newCategory.imageUrl || ''}
                                                    className="image-input"
                                                    readOnly
                                                    aria-label="Portada nueva categoría"
                                                />
                                                <label className="upload-btn" title="Subir imagen">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                // Simular subida de imagen
                                                                const mockImageUrl = `/uploads/${e.target.files[0].name}`;
                                                                handleNewCategoryChange('imageUrl', mockImageUrl);
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
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - solo mostrar si hay resultados */}
                    {totalElements > 0 && (
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
                                Resultado {startIndex + 1} a {Math.min(startIndex + pageSize, totalElements)} de {totalElements}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default CategoryManagement;