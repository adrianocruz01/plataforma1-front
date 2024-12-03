import HomeButton from "../HomeButton";
import WhatsApp from "@/assets/images/icone-conexao-wpp.png";
import Conversas from "@/assets/images/icone-mensagens.png";
import Zury from "@/assets/images/botao-zury.png";
import { useState, useEffect } from "react";

const Nav = () => {
    const [assistant, setAssistant] = useState({
        name: "",
        jobName: "",
        avatar: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const name = localStorage.getItem("name");
            const jobName = localStorage.getItem("jobName");
            const avatar = localStorage.getItem("avatar");

            if (name && jobName && avatar) {
                setAssistant({ name, jobName, avatar });
            } else {
                fetchAssistant();
            }
        }
    }, []);

    const fetchAssistant = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/agents/workspace/${process.env.NEXT_PUBLIC_WORKSPACE_ID}?page=1&pageSize=10000`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            const selectedAssistant = data.data.find(
                (assistant) =>
                    assistant.id === process.env.NEXT_PUBLIC_ASSISTANT_ID
            );
            if (selectedAssistant) {
                const { name, jobName, avatar } = selectedAssistant;
                localStorage.setItem("name", name);
                localStorage.setItem("jobName", jobName);
                localStorage.setItem("avatar", avatar);
                setAssistant({ name, jobName, avatar });
            }
        } catch (error) {
            console.error("Erro ao buscar assistente:", error);
        }
    };

    const handleLogout = () => {
        // Limpa todos os itens armazenados no localStorage
        localStorage.clear();
        // Redireciona para a página inicial ou de login
        window.location.href = "/";
    };

    const buttons = [
        {
            slug: "conexoes",
            title: "Conectar com WhatsApp",
            source: WhatsApp,
        },
        {
            slug: "chat",
            title: "Ver conversas",
            source: Conversas,
        },
        {
            slug: "/",
            title: "Voltar para Zury",
            source: Zury
        }
    ];

    return (
        <div className="flex lg:flex-col justify-center lg:items-center p-8 gap-5 buttons-box lg:bg-transparent lg:absolute z-10">
            {buttons.map((button, index) => (
                <HomeButton button={button} key={index} />
            ))}

            {/* Botão fixo de Logout */}
            <button
                onClick={handleLogout}
                className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
            >
                Sair
            </button>
        </div>
    );
};

export default Nav;
