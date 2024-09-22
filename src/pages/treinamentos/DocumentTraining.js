import { useState, useEffect, useRef } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";

const DocumentTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [domain, setDomain] = useState("");
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
        if (typeof window !== "undefined") {
            const { origin } = window.location;
            setDomain(origin);
        }
    }, []);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/trainings/agent/${process.env.NEXT_PUBLIC_ASSISTANT_ID}?page=1&pageSize=1000000&type=DOCUMENT`,
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

    const createTraining = async (fileTraining) => {
        if (!fileTraining || !fileTraining.name || !fileTraining.type || !fileTraining) {
            toast.error("Erro ao fazer upload.");
            return;
        }

        const payload = {
            type: "DOCUMENT",
            documentUrl: `${domain}${fileUrl}`,
            documentName: fileTraining.name,
            documentMimetype: fileTraining.type,
        };

        try {
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

    const warningText =
        "Tipos suportados: .pdf, .txt, .doc, .docx (Tamanho máx. 10MB)";

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
