import { useState, useEffect } from "react";

const Behavior = () => {
    const [newBehavior, setNewBehavior] = useState("");

    const createBehavior = async (e) => {
        if (!newBehavior) return;
        e.target.disabled = true;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/settings`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prefferModel: "GPT_3_5_TURBO",
                        behavior: newBehavior
                    }),
                }
            );
            e.target.disabled = false;
            alert("Comportamento enviado com sucesso!")
        } catch (error) {
            console.error("Erro ao editar comportamento:", error);
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
                        Novo comportamento
                    </label>
                    <textarea
                        id="new-training"
                        wrap="hard"
                        rows="5"
                        type="text"
                        value={newBehavior}
                        onChange={(e) => setNewBehavior(e.target.value)}
                        placeholder="Descreva o comportamento"
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
