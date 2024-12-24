import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Componentes Base
const FormInput = ({ icon: Icon, error, ...props }) => (
  <div className="relative group">
    {Icon && <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${error ? 'text-red-400' : 'text-gray-400'} h-5 w-5 transition-colors group-hover:text-cyan-400`} />}
    <input
      {...props}
      className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg pl-10 pr-4 py-3 
                 text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-cyan-500'} focus:border-transparent
                 hover:bg-white/10 hover:border-white/20
                 transition-all duration-300`}
    />
  </div>
);

const FormSelect = ({ icon: Icon, options, ...props }) => (
  <div className="relative group">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-cyan-400" />}
    <select
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 
                 text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                 hover:bg-white/10 hover:border-white/20
                 transition-all duration-300"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
const InputWithButton = ({ label, value, onClick, loading, placeholder }) => (
    <div className="relative flex space-x-3">
      <FormInput
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
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
        instanceName: '',
        jobDescription: '',
        jobName: '',
        behavior: '',
        communicationType: 'FORMAL',
        type: 'SUPPORT'
    });

    const [errors, setErrors] = useState({});
    const [isInstanceGenerated, setIsInstanceGenerated] = useState(false);
    const [isAgentGenerated, setIsAgentGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingInstance, setLoadingInstance] = useState(false);
    const [loadingGPT, setLoadingGPT] = useState(false);
    const [step, setStep] = useState(1);
    const router = useRouter();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validateStep1 = () => {
        const newErrors = {};
        
        // Validação do nome
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
        }
        
        // Validação do email
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        // Validação da senha
        if (!formData.senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (formData.senha.length < 6) {
            newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
            newErrors.senha = 'A senha deve conter letras maiúsculas, minúsculas e números';
        }
        
        // Validação da confirmação de senha
        if (!formData.confirmarSenha) {
            newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
        } else if (formData.senha !== formData.confirmarSenha) {
            newErrors.confirmarSenha = 'As senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (step === 1 && !validateStep1()) {
            Object.values(errors).forEach(error => {
                toast.error(error);
            });
            return;
        }
        setStep(step + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Criar instância no Evolution
            const instanceBody = {
                instanceName: formData.instanceName.replace(/\s+/g, ''),
                qrcode: true,
                webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL,
                webhook_base64: true,
                events: ['MESSAGES_UPSERT'],
            };

            const evolutionResponse = await fetch('https://evolution.zury.ai/instance/create', {
                method: 'POST',
                headers: {
                    'apikey': 'tyMMcaDhWqv7ALspyd59KK1Lnqf7hA',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_EVO_TOKEN}`,
                },
                body: JSON.stringify(instanceBody),
            });

            if (!evolutionResponse.ok) {
                const errorData = await evolutionResponse.json();
                throw new Error(errorData.message || 'Erro ao criar instância no Evolution');
            }

            const evolutionData = await evolutionResponse.json();
            const instanceName = evolutionData.instance.instanceName;

            // 2. Criar agente no GPTMaker
            const agentBody = {
                name: formData.instanceName,
                behavior: formData.behavior,
                communicationType: formData.communicationType,
                type: formData.type,
                jobDescription: formData.jobDescription,
                jobName: formData.jobName
            };

            const gptResponse = await fetch('https://api.gptmaker.ai/v2/workspace/3C60D739C709E042E9C21686415D2D58/agents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agentBody),
            });

            if (!gptResponse.ok) {
                const errorData = await gptResponse.json();
                throw new Error(errorData.message || 'Erro ao criar agente no GPTMaker');
            }

            const gptData = await gptResponse.json();
            const agentId = gptData.id;

            // 3. Criar usuário na plataforma
            const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_DEV}/api/clientes/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    evolution: {
                        id: instanceName,
                        token: `${process.env.NEXT_PUBLIC_EVO}`
                    },
                    gptMake: {
                        id: agentId,
                        token: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                    }
                }),
            });

            const registerData = await registerResponse.json();

            if (registerResponse.ok) {
                toast.success('Conta criada com sucesso!');
                router.push('/login');
            } else {
                throw new Error(registerData.message || 'Erro ao realizar registro');
            }
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Criar Conta</h2>
                    <p className="text-gray-400">Passo {step} de 2</p>
                    {step === 1 && (
                        <p className="text-sm text-gray-400 mt-2">
                            Preencha seus dados pessoais para criar sua conta
                        </p>
                    )}
                    {step === 2 && (
                        <p className="text-sm text-gray-400 mt-2">
                            Configure seu assistente virtual
                        </p>
                    )}
                </div>

                {step === 1 && (
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                        <div>
                            <FormInput
                                icon={UserIcon}
                                type="text"
                                name="nome"
                                placeholder="Nome completo"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                error={errors.nome}
                            />
                            {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
                        </div>

                        <div>
                            <FormInput
                                icon={EmailIcon}
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={errors.email}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <FormInput
                                icon={LockIcon}
                                type="password"
                                name="senha"
                                placeholder="Senha"
                                value={formData.senha}
                                onChange={handleChange}
                                required
                                error={errors.senha}
                            />
                            {errors.senha && <p className="mt-1 text-sm text-red-500">{errors.senha}</p>}
                            <p className="mt-1 text-xs text-gray-400">
                                A senha deve conter no mínimo 6 caracteres, incluindo letras maiúsculas, minúsculas e números
                            </p>
                        </div>

                        <div>
                            <FormInput
                                icon={LockIcon}
                                type="password"
                                name="confirmarSenha"
                                placeholder="Confirmar senha"
                                value={formData.confirmarSenha}
                                onChange={handleChange}
                                required
                                error={errors.confirmarSenha}
                            />
                            {errors.confirmarSenha && <p className="mt-1 text-sm text-red-500">{errors.confirmarSenha}</p>}
                        </div>

                        <ActionButton type="submit">
                            Próximo
                        </ActionButton>

                        <p className="text-center text-sm text-gray-400">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-cyan-500 hover:text-cyan-400">
                                Faça login
                            </Link>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <FormInput
                                icon={UserIcon}
                                type="text"
                                name="instanceName"
                                value={formData.instanceName}
                                onChange={handleChange}
                                placeholder="Nome da sua Zury"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Este nome será usado para Zury se identificar
                            </p>
                        </div>

                        <div>
                            <FormInput
                                icon={IdIcon}
                                type="text"
                                name="jobName"
                                value={formData.jobName}
                                onChange={handleChange}
                                placeholder="Nome da Empresa"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Nome da sua empresa, produto ou serviço
                            </p>
                        </div>

                        <div>
                            <FormInput
                                type="text"
                                name="jobDescription"
                                value={formData.jobDescription}
                                onChange={handleChange}
                                placeholder="Descrição da Empresa"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Descreva brevemente sua empresa, produto ou serviço
                            </p>
                        </div>

                        <div>
                            <FormInput
                                type="text"
                                name="behavior"
                                value={formData.behavior}
                                onChange={handleChange}
                                placeholder="Personalidade da Zury"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Defina como sua Zury deve se comportar e interagir
                            </p>
                        </div>

                        <div>
                            <FormSelect
                                name="communicationType"
                                value={formData.communicationType}
                                onChange={handleChange}
                                options={[
                                    { value: 'FORMAL', label: 'Formal' },
                                    { value: 'NORMAL', label: 'Normal' },
                                    { value: 'RELAXED', label: 'Descontraído' }
                                ]}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Escolha o estilo de comunicação da sua Zury
                            </p>
                        </div>

                        <div>
                            <FormSelect
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                options={[
                                    { value: 'SUPPORT', label: 'Suporte' },
                                    { value: 'SALE', label: 'Vendas' },
                                    { value: 'PERSONAL', label: 'Uso Pessoal' }
                                ]}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Selecione o tipo de atuação da sua IA
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <ActionButton type="button" onClick={() => setStep(1)}>
                                Voltar
                            </ActionButton>
                            <ActionButton type="submit" loading={loading}>
                                {loading ? 'Criando sua conta...' : 'Criar Conta'}
                            </ActionButton>
                        </div>

                        {loading && (
                            <div className="text-center text-sm text-gray-400">
                                <p>Aguarde enquanto configuramos sua conta:</p>
                                <ul className="mt-2 space-y-1">
                                    <li>• Criando Inteligência Artificial</li>
                                    <li>• Configurando Sua Conexão</li>
                                    <li>• Finalizando Registro na Plataforma</li>
                                </ul>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}