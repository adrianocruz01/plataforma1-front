import { useState, useEffect } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";

const DocumentTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [newTrainingDocument, setNewTrainingDocument] = useState("");
    const [newTrainingDocURL, setNewTrainingDocURL] = useState("");

    useEffect(() => {
        fetchTrainings();
    }, [trainings]);

    const fetchTrainings = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_IBASEURL}/trainings/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}?page=1&pageSize=1000000&type=DOCUMENT`,
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
        if (!newTrainingDocument || !newTrainingDocURL) {
            toast.error("Os campos 'Novo treinamento' e 'Nome do arquivo' não podem ser vazios!");
            return;
        }
        e.target.disabled = true;
        const payload = {
            type: "DOCUMENT",
            documentUrl: newTrainingDocURL,
            documentName: newTrainingDocument,
            documentMimetype: "application/pdf",
        };
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_IBASEURL}/trainings/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}`,
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
                toast.success('Treinamento cadastrado!')
                setTrainings([...trainings, data]);
                setNewTrainingDocument("");
                setNewTrainingDocURL("");
            } else {
                toast.error('Erro ao criar treinamento.')
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
                    <input
                        id="new-training"
                        type="text"
                        value={newTrainingDocURL}
                        onChange={(e) => setNewTrainingDocURL(e.target.value)}
                        placeholder="Insira a URL de um arquivo PDF"
                        className="rounded-md p-3 focus-visible:outline-none border bg-white border-neutral-100 focus-visible:border-neutral-300"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs mb-2 border-l border-orange-600"
                    >
                        Nome do arquivo
                    </label>
                    <input
                        id="new-training"
                        type="text"
                        value={newTrainingDocument}
                        onChange={(e) => setNewTrainingDocument(e.target.value)}
                        placeholder='Insira o nome do arquivo, como "Nome do arquivo.pdf"'
                        className="rounded-md p-3 focus-visible:outline-none border bg-white border-neutral-100 focus-visible:border-neutral-300"
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
                        type={"document"}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default DocumentTraining;
