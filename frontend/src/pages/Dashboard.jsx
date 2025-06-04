import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/HeaderAdmin';
import CourseCard from '../components/CourseCard';
import { courseService } from '../services/api';
import '../styles/Dashboard.css';
import mottoImage from '../assets/motto-image.png';
import Footer from '../components/Footer';
import { mockCourses } from '../data/mockCourses';


const Dashboard = () => {
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
    const [courses, setCourses] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Si no está autenticado, redirigir al login
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        // Si el usuario no es admin, redirigir
        if (!authLoading && user && user.role !== 'ADMIN') {
            navigate('/unauthorized');
            return;
        }

        // Si tenemos usuario admin, cargar los cursos
        if (user && user.role === 'ADMIN') {
            loadCourses();
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            // const coursesResponse = await courseService.getAllCourses();
            // setCourses(coursesResponse.data || []);
            setCourses(mockCourses);
        } catch (error) {
            console.error('Error loading courses:', error);
            setError('Error al cargar los cursos');

            // Si es error de autenticación, hacer logout
            if (error.response?.status === 401) {
                await logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            navigate('/login');
        }
    };

    const nextSlide = () => {
        if (courses.length > 0) {
            const totalSlides = Math.ceil(courses.length / 4);
            setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        }
    };

    const prevSlide = () => {
        if (courses.length > 0) {
            const totalSlides = Math.ceil(courses.length / 4);
            setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
        }
    };

    // Mostrar loading mientras se autentica
    if (authLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Cargando...</div>
            </div>
        );
    }

    // Si no está autenticado o no es admin, no mostrar nada (ya se redirigió)
    if (!isAuthenticated || !user || user.role !== 'ADMIN') {
        return null;
    }

    // Mostrar loading mientras se cargan los cursos
    if (loading) {
        return (
            <div className="dashboard-page">
                <Header isLoggedIn={true} isAdmin={true} />
                <div className="loading-container">
                    <div className="loading-spinner">Cargando dashboard...</div>
                </div>
            </div>
        );
    }

    // Mostrar error si existe
    if (error) {
        return (
            <div className="dashboard-page">
                <Header isLoggedIn={true} isAdmin={true} />
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={loadCourses}>Reintentar</button>
                </div>
            </div>
        );
    }

    return (
        <div>
        <Header
                    texto1="Categorías"
                    texto2="Cursos"
                    texto3="Módulos"
                    texto4="Estadísticas"
        />
        <div className="dashboard-page">
            <main>
                <section className="courses-section">
                    <div className="section-header">
                        <h2>Información sobre cursos y servicios</h2>
                        <p>Te acompañamos en tu evolución</p>
                    </div>

                    {courses.length > 0 ? (
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
                    ) : (
                        <div className="no-courses">
                            <p>No hay cursos disponibles</p>
                        </div>
                    )}

                    <section className="motto-section">
                        <div className="motto-content">
                            <div className="motto-text">
                                <h2>Pequeños avances<br />grandes transformaciones</h2>
                            </div>
                            <div className="motto-image-container">
                                <img
                                    src={mottoImage}
                                    alt="Transformación personal"
                                    className="motto-image"
                                />
                            </div>
                        </div>
                    </section>
                </section>

                <section id="about" className="about-section">
                    <h2 className="section-title">Sobre Nosotros</h2>
                    <div className="about-container">
                        <aside className="about-card">
                            <h3>¿Por qué lo hacemos?</h3>
                            <p>En EmpoderaTé, creemos en el poder transformador de la educación y el desarrollo personal. Nuestra misión es proporcionar herramientas y conocimientos que impulsen el crecimiento profesional y personal de las mujeres.</p>
                            <ul className="about-list">
                                <li>Promovemos la igualdad de oportunidades</li>
                                <li>Desarrollamos habilidades de liderazgo</li>
                                <li>Fomentamos el emprendimiento femenino</li>
                                <li>Construimos una comunidad de apoyo</li>
                            </ul>
                        </aside>

                        <aside className="about-card">
                            <h3>¿Para quién va dirigido?</h3>
                            <p>Nuestros programas están diseñados para mujeres que buscan:</p>
                            <ul className="about-list">
                                <li>Desarrollo profesional y personal</li>
                                <li>Emprender sus propios negocios</li>
                                <li>Fortalecer sus habilidades de liderazgo</li>
                                <li>Conectar con una comunidad de mujeres emprendedoras</li>
                            </ul>
                        </aside>
                    </div>
                </section>

                <section id="contact" className="contact-section">
                    <h2 className="section-title">Contáctanos</h2>
                    <div className="contact-container">
                        <div className="contact-info">
                            <h3>¿Tienes alguna pregunta?</h3>
                            <p>Estamos aquí para ayudarte en tu proceso de crecimiento</p>
                            <div className="contact-details">
                                <p><i className="fas fa-envelope"></i> info@empoderate.com</p>
                                <p><i className="fas fa-phone"></i> +57 300 123 4567</p>
                                <p><i className="fas fa-map-marker-alt"></i> Tunja, Boyacá</p>
                            </div>
                        </div>
                        <form className="contact-form">
                            <div className="form-group">
                                <input type="text" placeholder="Nombre completo" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Correo electrónico" required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Mensaje" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Enviar mensaje</button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
        </div>
    );
};

export default Dashboard;