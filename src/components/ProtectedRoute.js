import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (!loading) {
            const checkAuth = async () => {
                console.log('Verificando autenticação...');
                const authenticated = isAuthenticated();
                console.log('Status da autenticação:', authenticated);

                if (!authenticated && router.pathname !== '/login') {
                    console.log('Usuário não autenticado, redirecionando para login...');
                    try {
                        await router.push('/login');
                        console.log('Redirecionamento para login concluído');
                    } catch (error) {
                        console.error('Erro ao redirecionar:', error);
                    }
                } else if (authenticated) {
                    console.log('Usuário autenticado, permitindo renderização');
                    setShouldRender(true);
                }
            };
            
            checkAuth();
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        console.log('Carregando...');
        return <div>Carregando...</div>;
    }

    console.log('Estado final de renderização:', { shouldRender });
    return shouldRender ? children : null;
};

export default ProtectedRoute;
