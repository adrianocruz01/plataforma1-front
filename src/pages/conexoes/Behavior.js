import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const Behavior = () => {
    const [qrCode, setQrCode] = useState(null);
    const [error, setError] = useState(null);

    const fetchQrCode = async () => {
        setError(null);
        try {
            const response = await fetch('https://plataforma-back-wel-5bb2577d4a10.herokuapp.com/qr-code-json', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar QR Code');
            }

            const data = await response.json();
            if (data.connected) {
                setQrCode('Seu WhatsApp já está conectado à Z-API.');
            } else if (data.qrCodeBase64) {
                setQrCode(`data:image/png;base64,${data.qrCodeBase64}`);
            } else {
                setQrCode('Erro ao obter QR Code.');
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
                        className="pl-2 text-xs mb-2 border-l border-orange-600"
                    >
                        Conecte seu WhatsApp com a inteligência da Zury
                    </label>
                </div>
                <button
                    className="self-end px-3 py-2 bg-sky-600 text-white rounded-md font-medium shadow"
                    onClick={fetchQrCode}
                >
                    {'Atualizar QR Code'}
                </button>
                <a>

                </a>
                <Link
                    className="self-end px-3 py-2 bg-sky-600 text-white rounded-md font-medium shadow"
                    onClick={fetchQrCode}
                    target="_blank"
                    href={"https://crm.zury.ai/connections"}
                >
                    {'Voltar pra Zury'}
                </Link>
                {error && <p className="text-red-600">{error}</p>}
                {qrCode && (
                    <div> 
                        {qrCode !== "Seu WhatsApp já está conectado à Z-API." ? (<Image src={qrCode} alt="WhatsApp conectado" />) : 
                        (<div className="text-green-700 bg-green-100 p-1 rounded-md">
                        <CheckCircleOutlinedIcon fontSize="large" />
                        </div>)
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default Behavior;
