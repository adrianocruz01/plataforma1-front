import { useState, useEffect } from "react";
import Link from "next/link";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { toast } from "react-toastify";

const Connection = () => {
    const [qrCode, setQrCode] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchQrCode = async () => {
        setIsLoading(true);
        setError(null); // Resetar o erro antes de uma nova tentativa

        // Obter os dados do localStorage
        const storedUserString = localStorage.getItem("user");
        if (!storedUserString) {
            console.error("Nenhum dado encontrado no localStorage");
            setError("Dados necessários não encontrados. Por favor, faça login novamente.");
            setIsLoading(false);
            return;
        }

        let userData;
        try {
            userData = JSON.parse(storedUserString); // Parse dos dados armazenados
            // console.log("Dados do usuário do localStorage:", userData);
        } catch (error) {
            console.error("Erro ao fazer parse dos dados do usuário:", error);
            setError("Erro ao carregar dados do usuário. Por favor, faça login novamente.");
            setIsLoading(false);
            return;
        }

        const { cliente } = userData;
        const { evolution } = cliente;

        // Verifique se os dados necessários existem
        if (!cliente?.id || !evolution?.id || !evolution?.token) {
            console.error("Dados necessários do Evolution não encontrados no localStorage");
            setError("Dados necessários não encontrados. Por favor, faça login novamente.");
            setIsLoading(false);
            return;
        }

        // console.log("cliente.id:", cliente.id);
        // console.log("cliente.evolution.id:", evolution.id);
        // console.log("cliente.evolution.token:", evolution.token);

        try {
            const clienteId = cliente.id;
            const instance = evolution.id;

            // console.log("Parâmetros da requisição:", { clienteId, instance });

            // Construir a URL com parâmetros de query
            const url = new URL("https://plataformazury-back-0eae0e8c7115.herokuapp.com/api/message/qr-code-json");
            url.searchParams.append("clienteId", clienteId);
            url.searchParams.append("instance", instance);

            // console.log("URL da requisição:", url.toString());

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${userData.token}`,
                    "Content-Type": "application/json",
                },
            });

            // console.log("Status da resposta:", response.status);

            // Verifique se a resposta é JSON antes de tentar parsear
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const responseData = await response.json();
                console.log("Dados da resposta:", responseData);

                if (response.ok) {
                    if (responseData.connected) {
                        setIsConnected(true);
                        setQrCode("Seu WhatsApp já está conectado à Zury.");
                        toast.success("WhatsApp conectado com sucesso!");
                    } else if (responseData.qrCodeBase64) {
                        setIsConnected(false);
                        setQrCode(`data:image/png;base64,${responseData.qrCodeBase64}`);
                    } else if (responseData.error) {
                        setError(responseData.error);
                    } else {
                        setQrCode("Não foi possível obter o QR Code.");
                    }
                } else {
                    console.error("Erro na API:", responseData);
                    throw new Error(responseData.mensagem || "Erro ao buscar QR Code");
                }
            } else {
                const text = await response.text();
                console.error("Resposta não é JSON:", text);
                throw new Error("Resposta inesperada do servidor.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error.message);
            setError(error.message || "Erro ao buscar QR Code. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQrCode();
        const interval = setInterval(fetchQrCode, 30000); // Atualiza a cada 5 segundos
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex gap-5 mb-6 flex-col">
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                    >
                        Conecte seu WhatsApp com a inteligência da Zury
                    </label>
                </div>
                <div className="flex flex-wrap flex-col">
                    {error && <p className="text-red-600 mx-auto">{error}</p>}
                    {isLoading && <p className="text-neutral-100 mx-auto">Carregando...</p>}
                    {qrCode && (
                        <div className="mx-auto gradient-container rounded-xl">
                            {!isConnected ? (
                                <img
                                    src={qrCode} // Exibindo a imagem base64 diretamente
                                    width={300}
                                    height={300}
                                    className="p-px rounded-xl shadow-xl"
                                    alt="QR Code do WhatsApp"
                                />
                            ) : (
                                <div className="text-green-700 bg-green-100 shadow p-7 gap-4 rounded-xl flex flex-col items-center justify-center">
                                    <span className="text-9xl flex items-center">
                                        <CheckCircleOutlinedIcon fontSize="inherit" />
                                    </span>
                                    <span className="text-lg font-medium text-center">
                                        {qrCode}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col mx-auto sm:w-fit gap-6 mt-10 sm:mb-0">
                        <button
                            className="px-3 py-2 button-gradient text-white rounded-md before:rounded-md font-medium shadow"
                            onClick={fetchQrCode}
                            disabled={isLoading}
                        >
                            Atualizar QR Code
                        </button>
                        <Link
                            className="px-3 py-2 button-gradient text-white rounded-md before:rounded-md font-medium shadow text-center"
                            target="_blank"
                            href={"https://crm.zury.ai/connections"}
                        >
                            Voltar para Zury
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Connection;
