import { useEffect, useState } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";

const AudioTraining = () => {
    const [newTrainingText, setNewTrainingText] = useState("");
    const { startRecognition, transcript, isListening } =
        useSpeechRecognition();

    const createTraining = async (e) => {
        if (!newTrainingText) return;
        e.target.disabled = true;
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/affirmations`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        description: newTrainingText,
                        image: null
                    }),
                }
            );
            setNewTrainingText("");
            e.target.disabled = false;
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
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
