import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { GlobalLoading } from '../ui/Skeletons';
import { adminUrl, mainUrl, isInAdminApp } from '@/lib/urls';

type UserRole = 'patient' | 'provider' | 'admin';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const onAdminDomain = isInAdminApp();
    const toastFired = useRef(false);

    // Determine if role mismatch exists so we can show a toast
    const roleMismatch = isAuthenticated && user && !allowedRoles.includes(user.role);

    useEffect(() => {
        if (roleMismatch && !toastFired.current) {
            toastFired.current = true;
            toast.info("You've been redirected to your dashboard.");
        }
    }, [roleMismatch]);

    if (isLoading) {
        return <GlobalLoading />;
    }

    if (!isAuthenticated) {
        const redirectTo = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirectTo=${redirectTo}`} state={{ from: location }} replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the right role
        // Redirect them to their appropriate dashboard (cross-domain if needed)
        if (user.role === 'admin') {
            if (onAdminDomain) {
                return <Navigate to="/dashboard" replace />;
            }
            // eslint-disable-next-line react-hooks/immutability
            window.location.href = adminUrl('/dashboard');
            return null;
        }
        if (user.role === 'provider') {
            if (onAdminDomain) {
                // eslint-disable-next-line react-hooks/immutability
                window.location.href = mainUrl('/provider');
                return null;
            }
            return <Navigate to="/provider" replace />;
        }
        if (user.role === 'patient') {
            if (onAdminDomain) {
                // eslint-disable-next-line react-hooks/immutability
                window.location.href = mainUrl('/dashboard');
                return null;
            }
            return <Navigate to="/dashboard" replace />;
        }

        if (onAdminDomain) {
            // eslint-disable-next-line react-hooks/immutability
            window.location.href = mainUrl('/');
            return null;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RoleGuard;
