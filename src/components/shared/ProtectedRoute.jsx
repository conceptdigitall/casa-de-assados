import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, userRole, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-text-primary">
                <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
                <p className="text-sm text-text-muted animate-pulse uppercase tracking-[0.2em]">Verificando Credenciais...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to={userRole === 'employee' ? '/admin/pos' : '/admin'} replace />;
    }

    return children;
}
