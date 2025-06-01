import React, { useState } from 'react';
import Header from '../components/HeaderAdmin';
import '../styles/Statistics.css';

const Statistics = () => {
    const [dataCategory, setDataCategory] = useState('inscripciones');
    const [selectedCharts, setSelectedCharts] = useState({
        bars: true,
        pie: true,
        line: true
    });

    const handleCategoryChange = (e) => {
        setDataCategory(e.target.value);
    };

    const handleChartTypeChange = (type) => {
        setSelectedCharts(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleGenerateCharts = () => {
        // Aquí iría la lógica para generar/actualizar los gráficos
        console.log('Generando gráficos de tipo:', selectedCharts);
        console.log('Para la categoría:', dataCategory);
    };

    return (
        <div className="statistics-management">
            <Header
                texto1="Categorías"
                texto2="Cursos"
                texto3="Módulos"
                texto4="Estadísticas"
            />
            <main className="main-content">
                <section className="content-container">
                    <h1 className="page-title">Estadísticas</h1>
                    <p className="page-subtitle">Una forma sencilla de analizar sus datos</p>

                    <div className="statistics-card">
                        <div className="statistics-form">
                            <div className="form-group">
                                <label htmlFor="data-category">Seleccione la categoría de datos que desea visualizar:</label>
                                <select 
                                    id="data-category" 
                                    className="select-input"
                                    value={dataCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="inscripciones">Inscripciones a cursos</option>
                                    <option value="usuarios">Usuarios registrados</option>
                                    <option value="cursos">Cursos completados</option>
                                    <option value="categorias">Categorías populares</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Seleccione el tipo de gráfico</label>
                                <div className="chart-types">
                                    <div className="chart-type-option">
                                        <input 
                                            type="checkbox" 
                                            id="chart-bars" 
                                            checked={selectedCharts.bars}
                                            onChange={() => handleChartTypeChange('bars')}
                                        />
                                        <label htmlFor="chart-bars">Gráfico de barras</label>
                                    </div>
                                    <div className="chart-type-option">
                                        <input 
                                            type="checkbox" 
                                            id="chart-pie" 
                                            checked={selectedCharts.pie}
                                            onChange={() => handleChartTypeChange('pie')}
                                        />
                                        <label htmlFor="chart-pie">Gráfico de torta</label>
                                    </div>
                                    <div className="chart-type-option">
                                        <input 
                                            type="checkbox" 
                                            id="chart-line" 
                                            checked={selectedCharts.line}
                                            onChange={() => handleChartTypeChange('line')}
                                        />
                                        <label htmlFor="chart-line">Gráfico de línea</label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    className="generate-btn" 
                                    onClick={handleGenerateCharts}
                                    disabled={!Object.values(selectedCharts).some(v => v)}
                                >
                                    Generar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="charts-container" id="charts-display">
                        {/* Los gráficos se mostrarán aquí */}
                        {/* Puedes usar una librería como Chart.js, recharts o similares */}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Statistics;