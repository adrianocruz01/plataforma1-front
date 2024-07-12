import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Treinamento from "../assets/images/treinamento.jpeg"
import WhatsApp from "../assets/images/whatsapp.jpeg"
import CRM from "../assets/images/crm.jpeg"
import MidiasSociais from "../assets/images/midias-sociais.jpeg"
import Ligacoes from "../assets/images/ligacoes.jpeg"
import Personalidade from "../assets/images/personalidade.jpeg"
import SMS from "../assets/images/sms.jpeg"
import TeConvida from "../assets/images/teconvida.jpeg"
import Card from "@/components/Card";

const HomePage = () => {
    const [assistants, setAssistants] = useState([]);

    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/workspace/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/assistants?page=1&pageSize=150&query=`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            setAssistants(data.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="home" assistants={assistants} />
            <div className="px-6 md:px-10 w-full bg-animate">
                <h1 className="text-3xl font-bold mt-16 mb-8">Playground Zury</h1>
                <div className="flex flex-wrap gap-8 justify-between">
                    <Card
                        href="conexoes"
                        title="Conectar WhatsApp"
                        src={WhatsApp}
                    />
                    <Card
                        href="comportamento"
                        title="Criar personalidade"
                        src={Personalidade}
                    />
                    <Card
                        href="treinamentos?tab=0"
                        title="Treinar Zury"
                        src={Treinamento}
                    />
                    <Card
                        href="treinamentos"
                        title="Ligações em massa"
                        src={Ligacoes}
                    />
                    <Card
                        href="treinamentos"
                        title="Sistema TeConvida"
                        src={TeConvida}
                    />
                    <Card
                        href="treinamentos"
                        title="Plataforma CRM"
                        src={CRM}
                    />
                    <Card
                        href="treinamentos"
                        title="Conectar com mídias sociais"
                        src={MidiasSociais}
                    />
                    <Card
                        href="treinamentos"
                        title="Disparo de SMS em massa"
                        src={SMS}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
