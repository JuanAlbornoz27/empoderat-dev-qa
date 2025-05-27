import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/UserDropdown.css';

const UserDropdown = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            const success = await logout();
            if (success) {
                navigate('/', { replace: true });
                window.location.reload(); // Forzar recarga para limpiar el estado
            }
        } catch (error) {
            console.error('Error durante logout:', error);
            // Forzar logout en caso de error
            localStorage.clear();
            navigate('/', { replace: true });
            window.location.reload();
        }
    };

    return (
        <div className="user-dropdown">
            <div className="user-dropdown-content">
                <div className="user-dropdown-info">
                    <span className="user-dropdown-role">{user?.role || 'Usuario'}</span>
                    <span className="user-dropdown-name">{user?.name || 'Usuario'}</span>
                </div>
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    type="button"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default UserDropdown;