import { useState, useEffect, useRef } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";

const DocumentTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    const fileUploadRef = useRef(null);

    const fileTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Selecione um arquivo primeiro.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.fileUrl) {
                setFileUrl(result.fileUrl);
                toast.success("Upload bem-sucedido!");
                createTraining(file, result.fileUrl);
                setFile(null);
                fileUploadRef.current.resetFile();
            } else {
                toast.error("Falha no upload do arquivo");
            }
        } catch (error) {
            toast.error("Erro no upload: " + error.message);
        }
    };

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            // Pegando o ID e token do GPT Maker do localStorage
            const cliente = JSON.parse(localStorage.getItem("cliente"));
            const gptMakeId = cliente.gptMake.id;
            const gptMakeToken = cliente.gptMake.token;

            const response = await fetch(
                `/api/trainings/agent/${gptMakeId}?type=DOCUMENT`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${gptMakeToken}`,
                    },
                }
            );

            const data = await response.json();
            setTrainings(data.data);
        } catch (error) {
            console.error("Erro ao buscar treinamentos:", error);
        }
    };

    const createTraining = async (fileTraining, fileUrl) => {
        if (!fileTraining || !fileTraining.name || !fileTraining.type) {
            toast.error("Erro ao fazer upload.");
            return;
        }

        // Pegando o ID e token do GPT Maker do localStorage
        const cliente = JSON.parse(localStorage.getItem("cliente"));
        const gptMakeId = cliente.gptMake.id;
        const gptMakeToken = cliente.gptMake.token;

        const payload = {
            type: "DOCUMENT",
            documentUrl: fileUrl,
            documentName: fileTraining.name,
            documentMimetype: fileTraining.type,
        };

        try {
            const response = await fetch(
                `http://localhost:3001/api/trainings/agent/${gptMakeId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${gptMakeToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                toast.success("Treinamento cadastrado!");
                fetchTrainings();
            } else {
                toast.error("Erro ao criar treinamento.");
            }
        } catch (error) {
            console.error("Erro ao criar treinamento:", error);
        }
    };

    const warningText = "Tipos suportados: .pdf, .txt, .doc, .docx (Tamanho máx. 10MB)";

    return (
        <div className="flex flex-col h-fit w-full bg-neutral-700 rounded-2xl p-8">
            <div className="flex gap-5 mb-6 flex-col">
                <FileUpload
                    ref={fileUploadRef}
                    onFileSelected={handleFileChange}
                    supportedTypes={fileTypes}
                    warningText={warningText}
                />
            </div>
            <button
                onClick={handleUpload}
                className="self-end px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
                disabled={!file}
            >
                {file ? "Enviar" : "Selecione um arquivo"}
            </button>
            <div className="mt-8">
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
