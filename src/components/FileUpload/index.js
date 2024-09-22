import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";

const FileUpload = forwardRef(({ onFileSelected, supportedTypes, warningText }, ref) => {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const resetFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    useImperativeHandle(ref, () => ({
        resetFile,
    }));

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!supportedTypes.includes(selectedFile.type)) {
            toast.error("Tipo de arquivo não suportado");
            return;
        }

        setFile(selectedFile);
        await onFileSelected(selectedFile);
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

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (!supportedTypes.includes(droppedFile.type)) {
            toast.error("Tipo de arquivo não suportado");
            return;
        }

        setFile(droppedFile);
        await onFileSelected(droppedFile);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const cancelUpload = async (e) => {
        e.stopPropagation();
        resetFile();
        await onFileSelected(null);
    };

    return (
        <div>
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
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <p className="text-center">
                        {file ? (
                            <span className="font-semibold text-sm">
                                {file.name}{" "}
                                <span onClick={(e) => cancelUpload(e)}>
                                    <CloseOutlined fontSize="inherit" />
                                </span>
                            </span>
                        ) : (
                            <span className="text-neutral-50 text-sm font-semibold">
                                <UploadFileOutlined /> Clique aqui para fazer
                                upload ou arraste e solte seu arquivo aqui.
                                <br />
                                <span className="text-neutral-400 text-xs font-normal">
                                    {warningText}
                                </span>
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default FileUpload;
