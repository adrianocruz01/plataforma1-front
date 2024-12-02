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
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, accessToken) => {
        // Salvar no localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Atualizar estado
        setToken(accessToken);
        setUser(userData);

        // Redirecionar para a página principal
        router.push('/');
    };

    const logout = () => {
        // Limpar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Limpar estado
        setToken(null);
        setUser(null);

        // Redirecionar para login
        router.push('/login');
    };

    const isAuthenticated = () => {
        return !!token;
    };

    return {
        token,
        user,
        login,
        logout,
        isAuthenticated,
        loading
    };
};
