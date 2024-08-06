import { useEffect, useState } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import { toast } from "react-toastify";

const AudioTraining = () => {
    const [newTrainingText, setNewTrainingText] = useState("");
    const { startRecognition, transcript, isListening, stopRecognition } =
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

    useEffect(() => {
        setNewTrainingText(transcript);
    }, [transcript]);

    return (
        <div className="flex flex-col h-fit w-full bg-neutral-700 rounded-b-2xl rounded-tr-2xl p-8">
            <div className="flex gap-6 mb-6 flex-col">
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
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
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                </div>
                <div className="flex justify-center items-center w-full relative">
                    <button
                        className={`absolute transition-all duration-300 ${isListening ? "animate-pulse bg-red-900" : "gradient-container"} -top-3 left-1/2 -ml-10 w-20 h-20 text-white rounded-full font-medium shadow`}
                        onClick={isListening ? stopRecognition : startRecognition}
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
                        className="ml-auto px-2 py-1 text-sm button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
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
