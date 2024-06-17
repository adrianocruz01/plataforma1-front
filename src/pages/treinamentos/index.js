import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Tabs from "@/components/Tabs";
import TextTraining from "./TextTraining";
import WebsiteTraining from "./WebsiteTraining";
import DocumentTraining from "./DocumentTraining";

const TrainingsPage = () => {
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

    const tabs = [
        { label: "Texto", id: "text", content: <TextTraining /> },
        { label: "Website", id: "website", content: <WebsiteTraining /> },
        { label: "Documento", id: "document", content: <DocumentTraining /> },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="treinamentos" assistants={assistants} />
            <div className="px-6 md:px-10 w-full bg-neutral-100">
                <h1 className="text-3xl font-bold mt-16 mb-8">Treinamentos</h1>
                <Tabs tabs={tabs} />
            </div>
        </div>
    );
};

export default TrainingsPage;
