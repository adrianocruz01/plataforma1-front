import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_DEV}/api/clientes/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                if (!data.token) {
                    toast.error('Resposta inválida do servidor');
                    return;
                }
                await login(data, data.token);
                toast.success('Login realizado com sucesso!');
            } else {
                toast.error(data.message || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            toast.error('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo à Zury</h2>
                    <p className="text-gray-400">Entre na sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Seu email"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                            Digite o email cadastrado na sua conta
                        </p>
                    </div>

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Sua senha"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                            Digite sua senha para acessar
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Entrando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span>Entrar</span>
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </button>

                    {loading && (
                        <div className="text-center text-sm text-gray-400">
                            <p>Aguarde enquanto verificamos suas credenciais</p>
                        </div>
                    )}

                    {/* <div className="flex items-center justify-between mt-4">
                        <Link 
                            href="/register" 
                            className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                            Criar uma conta
                        </Link>
                        <Link 
                            href="/recuperar-senha" 
                            className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                            Esqueceu a senha?
                        </Link>
                    </div> */}
                </form>
            </div>
        </div>
    );
}
