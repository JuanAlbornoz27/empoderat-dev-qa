import React from 'react';
import '../styles/UserDropdown.css';
import { userData } from '../data/userData';

const UserDropdown = () => {
    const handleLogout = () => {
        // Lógica para cerrar sesión
        console.log('Cerrando sesión...');
    };

    return (
        <div className="user-dropdown">
            <div className="user-dropdown-content">
                <div className="user-dropdown-info">
                    <span className="user-dropdown-role">{userData.role}</span>
                    <span className="user-dropdown-name">{userData.name}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default UserDropdown;