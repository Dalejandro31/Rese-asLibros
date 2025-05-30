import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
    redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ redirectTo = '/login' }) => {
    const { isAuthenticated, username } = useAuth();

    if (!isAuthenticated || username !== 'admin') {
        // Si no está logueado o no es admin, redirige
        return <Navigate to={redirectTo} replace />;
    }
    // Si es admin, renderiza la ruta hija
    return <Outlet />;
};

export default AdminRoute;