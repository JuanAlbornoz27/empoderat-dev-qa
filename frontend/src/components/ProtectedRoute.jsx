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
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verificación más estricta de roles
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/cursos" replace />;
    }

    if (aprendizOnly && user.role !== 'APRENDIZ') {
        return <Navigate to="/dashboard" replace />;
    }

    // Si la ruta requiere un rol específico
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Verificación adicional para separar completamente las rutas
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isAprendizRoute = location.pathname.startsWith('/curso') ||
        location.pathname.startsWith('/mis-cursos') ||
        location.pathname === '/cursos';

    if (isAdminRoute && user.role !== 'ADMIN') {
        return <Navigate to="/unauthorized" replace />;
    }

    if (isAprendizRoute && user.role !== 'APRENDIZ') {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;