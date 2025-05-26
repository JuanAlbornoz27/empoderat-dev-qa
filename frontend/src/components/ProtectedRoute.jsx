// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null, adminOnly = false, aprendizOnly = false }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirigir al login y guardar la ubicación actual
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verificar roles específicos
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/unauthorized" replace />;
    }

    if (aprendizOnly && user.role !== 'APRENDIZ') {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;