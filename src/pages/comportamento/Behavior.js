import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Behavior = () => {
    const [newBehavior, setNewBehavior] = useState("");
    const [assistant, setAssistant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBehavior();
    }, []);

    const fetchBehavior = async () => {
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
                setNewBehavior(selectedAssistant.behavior);
            }
            setAssistant(selectedAssistant);
        } catch (error) {
            console.error("Erro ao buscar comportamento:", error);
        }
    };

    const createBehavior = async (e) => {
        e.preventDefault();
        if (!newBehavior) {
            toast.error("A descrição da personalidade não pode ser vazia.");
            return;
        }

        if (!assistant) {
            toast.error("Nenhum assistente selecionado.");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                name: assistant.name,
                avatar: assistant.avatar,
                behavior: newBehavior,
                communicationType: assistant.communicationType,
                type: assistant.type,
                jobName: assistant.jobName,
                jobSite: assistant.jobSite,
                jobDescription: assistant.jobDescription,
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/agents/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            console.log(payload);
            if (response.ok) {
                toast.success("Personalidade atualizada!");
            } else {
                toast.error("Erro ao atualizar personalidade.");
            }
        } catch (error) {
            console.error("Erro ao atualizar personalidade:", error);
            toast.error("Erro ao atualizar personalidade.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex gap-5 mb-6 flex-col">
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                    >
                        Personalidade
                    </label>
                    <textarea
                        id="new-training"
                        wrap="hard"
                        rows="5"
                        type="text"
                        value={newBehavior}
                        onChange={(e) => setNewBehavior(e.target.value)}
                        placeholder="Descreva a personalidade"
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                </div>
                <button
                    className="self-end px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
                    onClick={createBehavior}
                    disabled={isLoading}
                >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                </button>
            </div>
        </div>
    );
};

export default Behavior;
