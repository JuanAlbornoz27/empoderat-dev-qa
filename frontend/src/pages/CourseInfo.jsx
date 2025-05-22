import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { courseService } from '../services/api';
import '../styles/CourseInfo.css';

const CourseInfo = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await courseService.getCourseById(id);
                setCourse(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
                setLoading(false);
            }
        };

        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);

        fetchCourse();
    }, [id]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!course) {
        return (
            <div className="course-not-found">
                <Header isLoggedIn={isLoggedIn} />
                <div className="container">
                    <h2>Curso no encontrado</h2>
                    <Link to="/" className="back-link">Volver a la página principal</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="course-info-page">
            <Header isLoggedIn={isLoggedIn} />

            <div className="course-banner" style={{ backgroundImage: `url(${course.bannerUrl})` }}>
                <div className="container">
                    <h1>{course.title}</h1>
                </div>
            </div>

            <div className="container">
                <div className="course-content">
                    <div className="course-details">
                        <div className="course-description">
                            <h2>Descripción del curso</h2>
                            <p>{course.fullDescription}</p>
                        </div>

                        <div className="course-modules">
                            <h2>Módulos</h2>
                            <ul className="modules-list">
                                {course.modules && course.modules.map((module, index) => (
                                    <li key={index} className="module-item">
                                        <div className="module-header">
                                            <h3>{module.title}</h3>
                                            <span className="module-duration">{module.duration}</span>
                                        </div>
                                        <p>{module.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="course-sidebar">
                        <div className="course-info-card">
                            <div className="info-item">
                                <span className="info-label">Duración</span>
                                <span className="info-value">{course.duration}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Nivel</span>
                                <span className="info-value">{course.level}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Categoría</span>
                                <span className="info-value">{course.category}</span>
                            </div>

                            <button className="enroll-button">Inscribirse al curso</button>
                        </div>

                        <div className="instructor-card">
                            <h3>Instructora</h3>
                            <div className="instructor-info">
                                <div className="instructor-avatar">
                                    <img src={course.instructor?.avatarUrl || '/default-avatar.png'} alt="Instructora" />
                                </div>
                                <div className="instructor-details">
                                    <h4>{course.instructor?.name || 'Información no disponible'}</h4>
                                    <p>{course.instructor?.bio || 'Información no disponible'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInfo;
