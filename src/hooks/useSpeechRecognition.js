import { useState, useRef } from "react";

const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const startRecognition = () => {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = "pt-BR";
            recognition.continuous = true;
            recognition.iterimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const results = event.results;
                const latestResult = results[results.length - 1];
                const transcript = Array.from(latestResult)
                    .map(result => result.transcript)
                    .join("");
                setTranscript(transcript);
            };

            recognition.onerror = (event) => {
                console.error("Erro ao reconhecer fala:", event.error);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
        } else {
            console.error(
                "A API de reconhecimento de fala não está disponível no seu navegador."
            );
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsListening(false);
        }
    };

    return { startRecognition, stopRecognition, transcript, isListening };
};

export default useSpeechRecognition;
