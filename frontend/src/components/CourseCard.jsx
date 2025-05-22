import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CourseCard.css';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    return (
        <div className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
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