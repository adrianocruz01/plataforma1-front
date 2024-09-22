import React from "react";

const Step5 = ({ formData, setFormData, validateStep }) => {
    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex mb-6 flex-col">
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Nome da campanha
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.name}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Áudio
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.audioName}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Data de início
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.dateStart.split("-").reverse().join("/")}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Hora de início
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.timeStart}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Data de encerramento
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.dateEnd.split("-").reverse().join("/")}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Hora de encerramento
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.timeEnd}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Lista de contatos
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.file.name}
                </div>
                <label
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Texto do SMS
                </label>
                <div className="font-medium text-lg text-neutral-300 mb-4">
                    {formData.smsText}
                </div>
            </div>
        </div>
    );
};

export default Step5;
