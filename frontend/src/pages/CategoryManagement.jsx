import React, { useState, useEffect, useMemo } from 'react';
import { mockCategories } from '../data/mockCategories';
import '../styles/CategoryManagement.css';
import Header from "../components/HeaderAdmin";

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

    // Cargar datos iniciales solo una vez
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simular delay de API solo para la carga inicial
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Cargar todos los datos
            setAllCategories(mockCategories);
            
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
                // Simular llamada a API (sin delay largo para mejor UX)
                await new Promise(resolve => setTimeout(resolve, 100));
                
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
                        <button className="add-category-btn" type="button">
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
                                                <button
                                                    className="action-btn info-btn"
                                                    aria-label={`Información categoría ${category.id}`}
                                                    title="Ver información"
                                                >
                                                    <i className="fas fa-info"></i>
                                                </button>
                                                <button
                                                    className="action-btn edit-btn"
                                                    aria-label={`Editar categoría ${category.id}`}
                                                    title="Editar categoría"
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
                                            </td>
                                            <td>{category.id}</td>
                                            <td>{category.name}</td>
                                            <td 
                                                className="description-cell"
                                                title={category.description}
                                            >
                                                {category.description.length > 50 
                                                    ? `${category.description.substring(0, 50)}...` 
                                                    : category.description
                                                }
                                            </td>
                                            <td className="text-center">{category.courseCount || 0}</td>
                                            <td className="image-cell">
                                                <div className="image-container">
                                                    <input
                                                        type="text"
                                                        placeholder="img.png"
                                                        value={category.imageUrl || ''}
                                                        readOnly
                                                        className="image-input"
                                                        aria-label={`Portada categoría ${category.id}`}
                                                    />
                                                    <label className="upload-btn" title="Subir imagen">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                if (e.target.files[0]) {
                                                                    handleImageUpload(category.id, e.target.files[0]);
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