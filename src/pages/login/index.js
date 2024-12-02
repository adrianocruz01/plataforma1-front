import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setsenha] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('Tentando login com:', { email, senha });
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_DEV}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    senha,
                }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Payload completo do login:', data);

            if (response.ok) {
                // Verifica se temos os dados necessários
                if (!data.token) {
                    console.error('Token não encontrado na resposta:', data);
                    toast.error('Resposta inválida do servidor');
                    return;
                }

                // Armazena o payload completo do usuário
                const userData = {
                    ...data // Mantém todos os dados da resposta
                };
                
                console.log('Dados completos sendo armazenados:', userData);
                
                await login(userData, data.token);
                toast.success('Login realizado com sucesso!');
            } else {
                toast.error(data.message || 'Erro ao realizar login');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            toast.error('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-900">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="senha" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                autoComplete="current-senha"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setsenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
