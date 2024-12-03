import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';

const UserIcon = () => (
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MailIcon = () => (
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LockIcon = () => (
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const IdIcon = () => (
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 9h10M7 15h5" />
    </svg>
);

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        evoToken: '',
        gptToken: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.senha !== formData.confirmarSenha) {
            toast.error('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_DEV}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    evolution: {
                        id: formData.evoToken,
                        token: `Bearer ${process.env.NEXT_PUBLIC_EVO}`
                    },
                    gptMake: {
                        id: formData.gptToken,
                        token: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                    }
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registro realizado com sucesso!');
                router.push('/login');
            } else {
                toast.error(data.message || 'Erro ao realizar registro');
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            toast.error('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 p-4">
            <div className="relative w-full max-w-md">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                
                <div className="relative backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
                    <div className="mb-8 text-center">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Criar Conta
                        </h2>
                        <p className="mt-2 text-gray-300">Preencha seus dados para se registrar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <UserIcon />
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>

                        <div className="relative">
                            <MailIcon />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Seu email"
                                required
                            />
                        </div>

                        <div className="relative">
                            <IdIcon />
                            <input
                                type="text"
                                name="evoToken"
                                value={formData.evoToken}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Evo ID"
                                required
                            />
                        </div>

                        <div className="relative">
                            <IdIcon />
                            <input
                                type="text"
                                name="gptToken"
                                value={formData.gptToken}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="GPT ID"
                                required
                            />
                        </div>

                        <div className="relative">
                            <LockIcon />
                            <input
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Sua senha"
                                required
                            />
                        </div>

                        <div className="relative">
                            <LockIcon />
                            <input
                                type="password"
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Confirme sua senha"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg py-3 px-4 font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Criar conta'
                            )}
                        </button>

                        <div className="text-center mt-4">
                            <Link 
                                href="/login" 
                                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                            >
                                Já tem uma conta? Faça login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}