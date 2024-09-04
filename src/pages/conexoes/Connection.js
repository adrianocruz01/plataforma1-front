import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { toast } from "react-toastify";

const Connection = () => {
    const [qrCode, setQrCode] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [error, setError] = useState(null);

    const fetchQrCode = async () => {
        setError(null);
        try {
            const response = await fetch(
                "https://lueur-back-c0816d489493.herokuapp.com/api/message/qr-code-json",
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar QR Code");
            }

            const data = await response.json();
            if (data.connected) {
                setIsConnected((prev) => {
                    if (prev === false) {
                        toast.success("WhatsApp conectado!");
                    }
                    return true;
                });
                setQrCode("Seu WhatsApp já está conectado à Zury.");
            } else if (data.qrCodeBase64) {
                setIsConnected(false);
                setQrCode(`data:image/png;base64,${data.qrCodeBase64}`);
            } else {
                setQrCode("Erro ao obter QR Code.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchQrCode();
        const interval = setInterval(fetchQrCode, 5000); // Atualiza a cada 5 segundos
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
                    {qrCode && (
                        <div className="mx-auto gradient-container rounded-xl">
                            {!isConnected ? (
                                <Image
                                    src={qrCode}
                                    width={300}
                                    height={300}
                                    className="p-px rounded-xl shadow-xl"
                                    alt="WhatsApp conectado"
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
                        >
                            Atualizar QR Code
                        </button>
                        <Link
                            className="px-3 py-2 button-gradient text-white rounded-md before:rounded-md font-medium shadow text-center"
                            onClick={fetchQrCode}
                            target="_blank"
                            href={"https://crm.zury.ai/connections"}
                        >
                            Voltar pra Zury
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Connection;
