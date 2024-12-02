import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carregar dados do localStorage quando o componente montar
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser && storedUser !== 'undefined') {
            setToken(storedToken);
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Erro ao fazer parse dos dados do usuário:', error);
                // Limpa os dados inválidos do localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (userData, accessToken) => {
        console.log('Login iniciado com:', { userData, accessToken });
        
        // Salvar no localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Atualizar estado
        setToken(accessToken);
        setUser(userData);

        console.log('Estados atualizados:', { token: accessToken, user: userData });

        // Redirecionar para a página principal
        try {
            await router.push('/');
            console.log('Redirecionamento concluído');
        } catch (error) {
            console.error('Erro no redirecionamento:', error);
        }
    };

    const logout = async () => {
        console.log('Logout iniciado');
        
        // Limpar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Limpar estado
        setToken(null);
        setUser(null);

        // Redirecionar para login
        try {
            await router.push('/login');
            console.log('Redirecionamento para login concluído');
        } catch (error) {
            console.error('Erro no redirecionamento do logout:', error);
        }
    };

    const isAuthenticated = () => {
        const isAuth = !!token;
        console.log('Verificação de autenticação:', { isAuth, token });
        return isAuth;
    };

    return {
        token,
        user,
        loading,
        login,
        logout,
        isAuthenticated
    };
};
