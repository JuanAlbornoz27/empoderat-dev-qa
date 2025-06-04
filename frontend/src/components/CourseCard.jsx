import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CourseCard.css';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    
    // Usar imageUrl y tener image como fallback
    const imageSource = course.imageUrl || course.image || '/src/assets/curso-default.png';

    // Manejar errores de carga de imagen
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/src/assets/curso-default.png'; // Asegúrate de tener esta imagen
    };

    return (
        <div className="course-card">
            <img 
                src={imageSource} 
                alt={course.title} 
                className="course-image" 
                onError={handleImageError}
            />
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <button
                className="learn-more-btn"
                onClick={() => navigate(`/courses/${course.id}`)}
            >
                Quiero saber más
            </button>
        </div>
    );
};

export default CourseCard;