import { useState, useEffect } from "react";
import Training from "@/components/Training";

const TextTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [newTrainingText, setNewTrainingText] = useState("");
    const [newTrainingImgURL, setNewTrainingImgURL] = useState("");

    useEffect(() => {
        fetchTrainings();
    }, [trainings]);

    const fetchTrainings = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/affirmations?page=1&pageSize=150&query=&TEXT`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            setTrainings(data.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const createTraining = async (e) => {
        if (!newTrainingText) return;
        e.target.disabled = true;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/affirmations`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        description: newTrainingText,
                        image:
                            newTrainingImgURL === "" ? null : newTrainingImgURL,
                    }),
                }
            );
            const data = await response.json();
            setTrainings([...trainings, data]);
            setNewTrainingText("");
            e.target.disabled = false;
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
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
                        Novo treinamento
                    </label>
                    <textarea
                        id="new-training"
                        wrap="hard"
                        rows="5"
                        type="text"
                        value={newTrainingText}
                        onChange={(e) => setNewTrainingText(e.target.value)}
                        placeholder="Descreva o treinamento"
                        className="rounded-md p-3 focus-visible:outline-none border border-neutral-100 focus-visible:border-neutral-300"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training-image"
                        className="pl-2 text-xs mb-2 border-l border-orange-600"
                    >
                        Adicione uma imagem
                    </label>
                    <input
                        id="new-training-image"
                        type="url"
                        value={newTrainingImgURL}
                        onChange={(e) => setNewTrainingImgURL(e.target.value)}
                        placeholder="URL da imagem (opcional)"
                        className="rounded-md p-3 focus-visible:outline-none border border-neutral-100 focus-visible:border-neutral-300"
                    />
                </div>
                <button
                    className="self-end px-3 py-2 bg-sky-600 text-white rounded-md font-medium shadow"
                    onClick={(e) => createTraining(e)}
                >
                    Cadastrar
                </button>
            </div>
            <div>
                {trainings.map((training, index) => (
                    <Training
                        training={training}
                        trainings={trainings}
                        setTrainings={setTrainings}
                        type={"text"}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default TextTraining;
