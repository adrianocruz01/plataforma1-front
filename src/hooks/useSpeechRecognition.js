import { useState } from "react";

const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    const startRecognition = () => {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = "pt-BR";
            recognition.continuous = false;
            
            recognition.onstart = function() {
                setIsListening(true);
            }
            
            recognition.onresult = function (event) {
                const transcript = event.results[0][0].transcript;
                setTranscript(transcript);
            };
            
            recognition.onerror = function (event) {
                console.error("Erro ao reconhecer fala:", event.error);
            };
            
            recognition.onend = function() {
                setIsListening(false);
            }
            
            recognition.start();
        } else {
            console.error(
                "A API de reconhecimento de fala não está disponível no seu navegador."
            );
        }
    };

    return { startRecognition, transcript, isListening };
};

export default useSpeechRecognition;
