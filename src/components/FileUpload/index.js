import React, { useState } from "react";
import { toast } from "react-toastify";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";

const FileUpload = ({ onUpload, supportedTypes }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!supportedTypes.includes(selectedFile.type)) {
            toast.error("Tipo de arquivo não suportado");
            return;
        }
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.fileUrl) {
                toast.success(result.message || "Arquivo enviado com sucesso");

                const data = {
                    name: file.name,
                    url: result.fileUrl,
                    type: file.type,
                };
                await onUpload(data);
            } else {
                toast.error("Falha no upload do arquivo");
            }
        } catch (error) {
            console.error("Erro no upload:", error);
            toast.error("Falha no upload do arquivo");
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (!supportedTypes.includes(droppedFile.type)) {
            toast.error("Tipo de arquivo não suportado");
            return;
        }
        setFile(droppedFile);
    };

    const handleClick = () => {
        document.getElementById("fileInput").click();
    };

    const cancelUpload = (e) => {
        e.stopPropagation();
        setFile(null);
    };

    return (
        <div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="border-dashed border border-neutral-900 rounded-lg p-1 mb-5">
                    <div
                        className={`bg-neutral-900 transition-all rounded-md text-white flex items-center justify-center p-6 min-h-20 ${
                            dragging ? "bg-neutral-300" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <p className="text-center">
                            {file ? (
                                <span className="font-semibold text-sm">
                                    {file.name}{" "}
                                    <span
                                        className=""
                                        onClick={(e) => cancelUpload(e)}
                                    >
                                        <CloseOutlined fontSize="inherit" />
                                    </span>
                                </span>
                            ) : (
                                <span className="text-neutral-50 text-sm font-semibold">
                                  <UploadFileOutlined /> Clique aqui para fazer upload ou arraste e
                                    solte seu documento aqui.
                                    <br />
                                    <span className="text-neutral-400 text-xs font-normal">Tipos suportados: .pdf, .txt, .doc, .docx
                                    (Tamanho máx. 10MB)</span>
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    className="self-end px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
                    type="submit"
                    disabled={uploading}
                >
                    {uploading ? "Enviando..." : "Enviar"}
                </button>
            </form>
        </div>
    );
};

export default FileUpload;
