import { useEffect, useState } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import { toast } from "react-toastify";

const AudioTraining = () => {
    const [newTrainingText, setNewTrainingText] = useState("");
    const { startRecognition, transcript, isListening } =
        useSpeechRecognition();

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

    useEffect(() => {
        setNewTrainingText(transcript);
    }, [transcript]);

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex gap-6 mb-6 flex-col">
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
                <div className="flex justify-center items-center w-full relative">
                    <button
                        className={`absolute ${isListening ? "animate-ping bg-red-500" : "bg-sky-600"} left-1/2 -ml-10 w-20 h-20 text-white rounded-full font-medium shadow`}
                        onClick={startRecognition}
                    >
                        <span className="text-4xl">
                            {isListening ? (
                                <MicOutlinedIcon fontSize="inherit" />
                            ) : (
                                <MicNoneOutlinedIcon fontSize="inherit" />
                            )}
                        </span>
                    </button>
                    <button
                        className="ml-auto px-3 py-2 text-sky-600 font-medium shadow"
                        onClick={(e) => createTraining(e)}
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioTraining;
