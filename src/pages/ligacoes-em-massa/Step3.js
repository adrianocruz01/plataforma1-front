import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";

const Step3 = ({ formData, setFormData, validateStep }) => {
    const fileTypes = ["text/csv"];

    const [file, setFile] = useState(null);
    const fileUploadRef = useRef(null);

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile);
    };

    const warningText = "Apenas arquivos do tipo .csv (Tamanho máx. 10MB)";

    useEffect(() => {
        setFormData({ ...formData, file: file });
    }, [file]);

    useEffect(() => {
        if (formData.file) {
            validateStep(true);
        } else {
            validateStep(false);
        }
    }, [formData.file]);

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex mb-6 flex-col">
                <label className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600">
                    Escolha uma lista de contatos no formato .CSV
                </label>
                <FileUpload
                    ref={fileUploadRef}
                    onFileSelected={handleFileChange}
                    supportedTypes={fileTypes}
                    warningText={warningText}
                />
            </div>
        </div>
    );
};

export default Step3;
