import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Behavior = () => {
    const [newBehavior, setNewBehavior] = useState("");

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
        } catch (error) {
            console.error("Erro ao buscar comportamento:", error);
        }
    };

    const createBehavior = async (e) => {
        if (!newBehavior) {
            toast.error("A descrição da personalidade não pode ser vazia.");
            return;
        }
        e.target.disabled = true;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/agents/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        behavior: newBehavior,
                    }),
                }
            );
            if (response.ok) {
                toast.success("Personalidade atualizada!");
            } else {
                toast.error("Erro ao atualizar personalidade.");
            }
            e.target.disabled = false;
        } catch (error) {
            console.error("Erro ao atualizar personalidade:", error);
        }
    };

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex gap-5 mb-6 flex-col">
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs mb-2 border-l border-orange-600"
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
                        className="rounded-md p-3 focus-visible:outline-none border border-neutral-100 focus-visible:border-neutral-300"
                    />
                </div>
                <button
                    className="self-end px-3 py-2 bg-sky-600 text-white rounded-md font-medium shadow"
                    onClick={(e) => createBehavior(e)}
                >
                    Cadastrar
                </button>
            </div>
        </div>
    );
};

export default Behavior;
