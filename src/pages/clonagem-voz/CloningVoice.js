import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";

const CloningVoice = () => {
    const fileTypes = [
        "audio/3gpp2",
        "audio/aac",
        "audio/aacp",
        "audio/adpcm",
        "audio/aiff",
        "audio/x-aiff",
        "audio/basic",
        "audio/flac",
        "audio/midi",
        "audio/mp4",
        "audio/mp4a-latm",
        "audio/mpeg",
        "audio/ogg",
        "audio/opus",
        "audio/vnd.digital-winds",
        "audio/vnd.dts",
        "audio/vnd.dts.hd",
        "audio/vnd.lucent.voice",
        "audio/vnd.ms-playready.media.pya",
        "audio/vnd.nuera.ecelp4800",
        "audio/vnd.nuera.ecelp7470",
        "audio/vnd.nuera.ecelp9600",
        "audio/vnd.wav",
        "audio/wav",
        "audio/x-wav",
        "audio/vnd.wave",
        "audio/wave",
        "audio/x-pn-wav",
        "audio/webm",
        "audio/x-matroska",
        "audio/x-mpegurl",
        "audio/x-ms-wax",
        "audio/x-ms-wma",
        "audio/x-pn-realaudio",
        "audio/x-pn-realaudio-plugin",
    ];

    const [file, setFile] = useState(null);
    const fileUploadRef = useRef(null);

    const getAudioDuration = (file) => {
        return new Promise((resolve, reject) => {
            const audio = document.createElement("audio");
            const objectUrl = URL.createObjectURL(file);

            audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration);
                URL.revokeObjectURL(objectUrl);
            });

            audio.addEventListener("error", (event) => {
                reject(event);
                URL.revokeObjectURL(objectUrl);
            });

            audio.src = objectUrl;
        });
    };

    const handleFileChange = async (selectedFile) => {
        try {
            const duration = await getAudioDuration(selectedFile);
            if (duration < 120) {
                toast.error("O áudio deve ter, no mínimo, 2 minutos!");
                return;
            }
            setFile(selectedFile);
        } catch (error) {
            toast.error("Erro ao carregar o arquivo de áudio.");
            console.error("Erro ao obter a duração do áudio:", error);
        }
    };

    const createClone = async () => {
        if (!file || !file.name || !file.type) {
            toast.error("Erro ao fazer upload.");
            return;
        }

        const formData = new FormData();
        formData.append("clientId", "generic_voice");
        formData.append("audio", file);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL_API}/audio/clone-voice`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                toast.success("Clone de voz realizado!");
                fileUploadRef.current.resetFile();
            } else {
                toast.error("Erro ao clonar voz.");
            }
        } catch (error) {
            console.error("Erro ao clonar voz:", error);
            toast.error("Erro ao clonar voz.");
        }
    };

    const warningText =
        "Apenas arquivos de áudio: .mp3, .ogg (Tamanho máx. 10MB)";

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex mb-6 flex-col">
                <label className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600">
                    Escolha um áudio (min. 2 minutos)
                </label>
                <FileUpload
                    ref={fileUploadRef}
                    onFileSelected={handleFileChange}
                    supportedTypes={fileTypes}
                    warningText={warningText}
                />
                <button
                    onClick={createClone}
                    className="self-end px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
                    disabled={!file}
                >
                    {file ? "Enviar" : "Selecione um arquivo"}
                </button>
            </div>
        </div>
    );
};

export default CloningVoice;
