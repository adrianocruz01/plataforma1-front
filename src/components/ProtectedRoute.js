import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            const checkAuth = async () => {
                const authenticated = isAuthenticated();
                if (!authenticated && router.pathname !== '/login') {
                    await router.push('/login');
                }
            };
            checkAuth();
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return isAuthenticated() ? children : null;
};

export default ProtectedRoute;
