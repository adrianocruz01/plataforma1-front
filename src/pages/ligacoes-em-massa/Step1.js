import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";

const Step1 = ({ formData, setFormData, validateStep }) => {
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
    const [audioName, setAudioName] = useState("");
    const [audioId, setAudioId] = useState(formData.content || null);
    const fileUploadRef = useRef(null);
    const [validation, setValidation] = useState({
        name: '',
        audioName: '',
        content: null,
    });

    const getAudioDuration = (audioFile) => {
        return new Promise((resolve, reject) => {
            const audio = document.createElement("audio");
            const objectUrl = URL.createObjectURL(audioFile);

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
        if (selectedFile) {
            try {
                const duration = await getAudioDuration(selectedFile);
                if (duration > 30) {
                    fileUploadRef.current.resetFile();
                    toast.error("O áudio deve ter, no máximo, 30 segundos!");
                    return;
                }
            } catch (error) {
                toast.error("Erro ao carregar o arquivo de áudio.");
                console.error("Erro ao obter a duração do áudio:", error);
            }
        }
        setFile(selectedFile);
    };

    const uploadAudio = async () => {
        if (!file) {
            toast.error("Erro ao fazer upload.");
            return;
        }

        if (!audioName) {
            setValidation({ ...validation, audioName: false });
            toast.error("O nome do aúdio não pode ser vazio.");
            return;
        }

        const formData = new FormData();
        formData.append("name", audioName);
        formData.append("audio", file);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL_API}/campaign/upload-audio`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();

            if (response.ok) {
                toast.success("Upload realizado!");
                setAudioId(data.return.cdw_file);
            } else {
                toast.error("Erro ao realizar o upload.");
            }
        } catch (error) {
            console.error("Erro ao realizar o upload:", error);
            toast.error("Erro ao realizar o upload.");
        }
    };

    const handleNameChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handleAudioNameChange = (e) => {
        setAudioName(e.target.value)
        setFormData({ ...formData, audioName: e.target.value });
    };

    const warningText =
        "Apenas arquivos de áudio, por exemplo: .mp3, .ogg (Tamanho máx. 10MB)";

    useEffect(() => {
        if (formData.name) {
            setValidation({ ...validation, name: true });
        } else {
            setValidation({ ...validation, name: false });
        }
    }, [formData.name]);

    useEffect(() => {
        if (audioName || audioId ) {
            setValidation({ ...validation, audioName: true });
        } else {
            setValidation({ ...validation, audioName: false });
        }
    }, [audioName]);

    useEffect(() => {
        if (audioId) {
            setFormData({ ...formData, content: audioId });
            setValidation({ ...validation, content: true });
        } else {
            setValidation({ ...validation, content: false });
        }
    }, [audioId]);

    useEffect(() => {
        const fieldsValidated = Object.values(validation);
        if (fieldsValidated.includes(false) || fieldsValidated.includes(null)) {
            validateStep(false);
        } else {
            validateStep(true);
        }
    }, [validation]);

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex mb-6 flex-col">
                <label
                    htmlFor="new-campaign"
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Nova campanha
                </label>
                <input
                    id="new-campaign"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e)}
                    placeholder="Insira o nome da campanha"
                    maxLength={50}
                    className={`rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4 ${
                        validation.name === false
                            ? "border border-red-500 border-spacing-2"
                            : ""
                    }`}
                />
                <label className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600">
                    Escolha um áudio (máx. 30 segundos)
                </label>
                <input
                    id="audio-name"
                    type="text"
                    value={formData.audioName}
                    onChange={(e) => handleAudioNameChange(e)}
                    placeholder="Insira o nome do áudio"
                    maxLength={50}
                    className={`rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4 ${
                        validation.audioName === false
                            ? "border border-red-500 border-spacing-2"
                            : ""
                    }`}
                />
                <FileUpload
                    ref={fileUploadRef}
                    onFileSelected={handleFileChange}
                    supportedTypes={fileTypes}
                    warningText={warningText}
                />
                <button
                    onClick={uploadAudio}
                    className="self-center px-3 py-2 gradient-container before:rounded-lg text-white rounded-md font-bold shadow"
                    disabled={!file}
                >
                    {file ? "Enviar" : "Selecione um arquivo"}
                </button>
            </div>
        </div>
    );
};

export default Step1;
