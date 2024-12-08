import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Componentes Base
const FormInput = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-cyan-400" />}
    <input
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 
                 text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                 hover:bg-white/10 hover:border-white/20
                 transition-all duration-300"
    />
  </div>
);

const ActionButton = ({ children, loading, ...props }) => (
  <button
    {...props}
    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 
               relative overflow-hidden rounded-lg py-3 px-4 
               font-medium text-white shadow-lg
               hover:shadow-cyan-500/25 hover:scale-[1.02]
               active:scale-[0.98]
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-300 transform"
  >
    <div className="relative flex items-center justify-center">
      {loading ? (
        <>
          <div className="absolute h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="opacity-0">{children}</span>
        </>
      ) : (
        <>
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
    </div>
  </button>
);

// Ícones
const IdIcon = () => (
  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor" 
       strokeWidth="2">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9h10M7 15h5" />
  </svg>
);

const EmailIcon = () => (
  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2">
    <path d="M12 15v2m-6 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a4 4 0 10-8 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Componente InputWithButton melhorado
const InputWithButton = ({ label, value, onChange, onClick, loading, placeholder }) => (
  <div className="relative flex space-x-3">
    <FormInput
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={loading}
      icon={IdIcon}
    />
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-purple-500
                 rounded-lg py-3 px-6 font-medium text-white
                 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]
                 active:scale-[0.98]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-300 transform"
    >
      {loading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        label
      )}
    </button>
  </div>
);

// Componente Principal
export default function Register() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        evoToken: '',
        gptToken: '',
    });

    const [loading, setLoading] = useState(false);
    const [loadingInstance, setLoadingInstance] = useState(false);
    const [loadingGPT, setLoadingGPT] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
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
                        token: `${process.env.NEXT_PUBLIC_EVO}`
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

    const createEvolutionInstance = async () => {
        try {
            setLoadingInstance(true);
            const instanceBody = {
                instanceName: formData.nome.replace(/\s+/g, ''),
                qrcode: true,
                webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL,
                webhook_base64: true,
                events: ['MESSAGES_UPSERT'],
            };

            const response = await fetch('https://evolution.zury.ai/instance/create', {
                method: 'POST',
                headers: {
                    'apikey': 'tyMMcaDhWqv7ALspyd59KK1Lnqf7hA',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_EVO_TOKEN}`,
                },
                body: JSON.stringify(instanceBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar instância no Evolution');
            }

            const data = await response.json();
            const instanceName = data.instance.instanceName;

            setFormData((prev) => ({
                ...prev,
                evoToken: instanceName,
            }));

            toast.success('Instance ID gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar Instance ID:', error);
            toast.error(error.message || 'Erro ao conectar com o Evolution');
        } finally {
            setLoadingInstance(false);
        }
    };

    const createGPTAgent = async () => {
        try {
            setLoadingGPT(true);
            const agentBody = {
                name: formData.nome,
            };

            const response = await fetch('https://api.gptmaker.ai/v2/workspace/3C60D739C709E042E9C21686415D2D58/agents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agentBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar agente no GPTMaker');
            }

            const data = await response.json();
            const agentId = data.id;

            setFormData((prev) => ({
                ...prev,
                gptToken: agentId,
            }));

            toast.success('Agente GPT criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar agente GPT:', error);
            toast.error(error.message || 'Erro ao conectar com o GPTMaker');
        } finally {
            setLoadingGPT(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 p-4">
            <div className="relative w-full max-w-md">
                <div className="relative backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
                    <div className="mb-8 text-center">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Criar Conta
                        </h2>
                        <p className="mt-2 text-gray-300">Preencha seus dados para se registrar</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <FormInput
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Seu nome completo"
                            required
                            icon={UserIcon}
                        />

                        <FormInput
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Seu email"
                            required
                            icon={EmailIcon}
                        />

                        <InputWithButton
                            label="Gerar ID"
                            value={formData.evoToken}
                            onChange={(e) => handleChange({ target: { name: 'evoToken', value: e.target.value } })}
                            onClick={createEvolutionInstance}
                            loading={loadingInstance}
                            placeholder="Instance ID"
                            readOnly
                        />

                        <InputWithButton
                            label="Gerar Agente"
                            value={formData.gptToken}
                            onChange={(e) => handleChange({ target: { name: 'gptToken', value: e.target.value } })}
                            onClick={createGPTAgent}
                            loading={loadingGPT}
                            placeholder="GPT Agent ID"
                            
                        />
                        

                        <FormInput
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            placeholder="Sua senha"
                            required
                            icon={LockIcon}
                        />

                        <FormInput
                            type="password"
                            name="confirmarSenha"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            placeholder="Confirme sua senha"
                            required
                            icon={LockIcon}
                        />

                        <ActionButton
                            type="submit"
                            disabled={loading}
                            loading={loading}
                        >
                            Criar conta
                        </ActionButton>

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