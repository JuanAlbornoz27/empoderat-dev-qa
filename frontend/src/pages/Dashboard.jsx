import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard';
import { authService, courseService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await authService.getCurrentUser();
                setUser(userResponse.data);
                setIsAdmin(userResponse.data.role === 'ADMIN');
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Redirect to login if unauthorized
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await courseService.getAllCourses();
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchUserData();
        fetchCourses();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === Math.ceil(courses.length / 4) - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? Math.ceil(courses.length / 4) - 1 : prev - 1));
    };

    if (!user) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="dashboard-page">
            <Header isLoggedIn={true} isAdmin={isAdmin} />

            <nav className="dashboard-nav">
                <ul>
                    <li><a href="#categorias">Categorías</a></li>
                    <li><a href="#cursos">Cursos</a></li>
                    <li><a href="#modulos">Módulos</a></li>
                    <li><a href="#estadisticas">Estadísticas</a></li>
                    <li><a href="#contactanos">Contáctanos</a></li>
                </ul>

                <div className="user-panel">
                    <div className="user-avatar">
                        <img src="/default-avatar.png" alt="Avatar" />
                    </div>
                    <div className="user-info">
                        <div className="user-role">Administrador</div>
                        <div className="user-name">{user.name}</div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                <section className="courses-section">
                    <div className="section-header">
                        <h2>Información sobre cursos y servicios</h2>
                        <p>Te acompañamos en tu evolución</p>
                    </div>

                    <div className="courses-slider">
                        <div className="slider-controls">
                            <button className="slider-arrow prev" onClick={prevSlide}>&#8249;</button>
                            <div className="courses-container">
                                {courses.slice(currentSlide * 4, (currentSlide + 1) * 4).map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                            <button className="slider-arrow next" onClick={nextSlide}>&#8250;</button>
                        </div>
                    </div>
                </section>
                <section id="about" className="section">
                    {/* Contenido de la sección Sobre Nosotros */}
                </section>

                <section id="contact" className="section">
                    {/* Contenido de la sección de contacto */}
                </section>

                <section className="motto-section">
                    <div className="motto-content">
                        <h2>Pequeños avances<br />grandes transformaciones</h2>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;