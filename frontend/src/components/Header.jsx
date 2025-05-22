import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/Header.css';
import logo from '../assets/empodera-logo.png';

const Header = ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-main">
                {/* Logo a la izquierda */}
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="EmpoderaT Logo" className="logo" />
                    </Link>
                </div>

                {/* Navegación y botones a la derecha */}
                <div className="right-container">
                    <Navigation isLoggedIn={isLoggedIn} />
                    <div className="auth-actions">
                        {isLoggedIn ? (
                            <div className="user-profile">
                                {isAdmin && <span className="admin-badge">Administrador</span>}
                                <button className="logout-btn" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <button className="login-btn" onClick={() => navigate('/login')}>
                                Iniciar sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;