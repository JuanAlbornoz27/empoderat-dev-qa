import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Unauthorized.css';
import Header from './HeaderIndex';
import Footer from './Footer';
import logo from '../assets/empodera-logo.png';

const Unauthorized = () => {
    return (
        <div className="unauthorized-page">
            <Header isLoggedIn={true} />

            <main className="unauthorized-content">
                <div className="unauthorized-container">
                    <div className="logo-container">
                        <img src={logo} alt="EmpoderaT Logo" className="logo-image" />
                    </div>

                    <h1 className="unauthorized-title">Acceso No Autorizado</h1>

                    <div className="unauthorized-message">
                        <p>Lo sentimos, no tienes permisos para acceder a esta página.</p>
                        <p>Por favor, contacta al administrador si crees que esto es un error.</p>
                    </div>

                    <div className="unauthorized-actions">
                        <Link to="/" className="back-button">
                            Volver al Dashboard
                        </Link>
                        <Link to="/" className="home-button">
                            Ir al Inicio
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Unauthorized;