import { useState, useEffect } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                `${process.env.NEXT_PUBLIC_BASEURL}/trainings/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}?page=1&pageSize=1000000&type=TEXT`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            setTrainings(data.data);
        } catch (error) {
            console.error("Erro ao buscar treinamentos:", error);
        }
    };

    const createTraining = async (e) => {
        if (!newTrainingText) {
            toast.error("O campo 'Novo treinamento' não pode ser vazio!");
            return;
        }
        e.target.disabled = true;
        try {
            const payload = {
                type: "TEXT",
                text: newTrainingText,
            };

            if (newTrainingImgURL) {
                payload.image = newTrainingImgURL;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/trainings/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (response.ok) {
                toast.success("Treinamento cadastrado!");
                setNewTrainingText("");
                setNewTrainingImgURL("");
                setTrainings([...trainings, data]);
            } else {
                toast.error("Erro ao criar treinamento.");
            }
            e.target.disabled = false;
        } catch (error) {
            console.error("Erro ao criar treinamento:", error);
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
                        Adicione uma imagem (URL)
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
