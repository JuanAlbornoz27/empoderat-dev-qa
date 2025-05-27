import React from 'react';
import '../styles/Navigation.css';

const Navigation = ({ isLoggedIn }) => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <nav className="navigation">
            <div className="nav-links">
                <button
                    onClick={() => scrollToSection('courses')}
                    className="nav-link"
                >
                    Cursos
                </button>
                <button
                    onClick={() => scrollToSection('about')}
                    className="nav-link"
                >
                    Sobre Nosotros
                </button>
                <button
                    onClick={() => scrollToSection('contact')}
                    className="nav-link"
                >
                    Contacto
                </button>
            </div>
            {isLoggedIn && (
                <div className="user-nav">
                    <button
                        onClick={() => scrollToSection('dashboard')}
                        className="nav-link"
                    >
                        Mi Panel
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navigation;