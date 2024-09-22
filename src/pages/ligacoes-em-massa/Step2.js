import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Step2 = ({ formData, setFormData, validateStep }) => {
    const today = new Date().toLocaleString().split(",")[0].split("/").reverse().join("-");
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Adiciona 15 minutos à hora atual
    const nowPlus15 = new Date(now.getTime() + 15 * 60000)
        .toTimeString()
        .slice(0, 5);

    const [validation, setValidation] = useState({
        dateStart: null,
        dateEnd: null,
        timeStart: null,
        timeEnd: null,
    });

    const handleDateStartChange = (e) => {
        setFormData({ ...formData, dateStart: e.target.value });
    };

    const handleDateEndChange = (e) => {
        setFormData({ ...formData, dateEnd: e.target.value });
    };

    const handleTimeStartChange = (e) => {
        setFormData({ ...formData, timeStart: e.target.value });
    };

    const handleTimeEndChange = (e) => {
        setFormData({ ...formData, timeEnd: e.target.value });
    };

    const validateDateStart = () => {
        if (formData.dateStart && formData.dateStart < today) {
            toast.error("A data de início deve ser hoje ou uma data futura.");
            setValidation((prev) => ({ ...prev, dateStart: false }));
        } else {
            setValidation((prev) => ({ ...prev, dateStart: true }));
        }
    };

    const validateDateEnd = () => {
        if (formData.dateEnd && formData.dateEnd < formData.dateStart) {
            toast.error(
                "A data de encerramento deve ser igual ou posterior à data de início."
            );
            setValidation((prev) => ({ ...prev, dateEnd: false }));
        } else {
            setValidation((prev) => ({ ...prev, dateEnd: true }));
        }
    };

    // Função de validação da hora de início
    const validateTimeStart = () => {
        if (
            formData.dateStart === today &&
            formData.timeStart &&
            formData.timeStart < nowPlus15
        ) {
            toast.error(
                "A hora de início deve ser pelo menos 15 minutos após a hora atual."
            );
            setValidation((prev) => ({ ...prev, timeStart: false }));
        } else {
            setValidation((prev) => ({ ...prev, timeStart: true }));
        }
    };

    const validateTimeEnd = () => {
        if (
            formData.dateStart &&
            formData.dateEnd &&
            formData.timeStart &&
            formData.timeEnd
        ) {
            const startTime = new Date(
                `${formData.dateStart}T${formData.timeStart}`
            );
            const endTime = new Date(`${formData.dateEnd}T${formData.timeEnd}`);

            if (
                formData.dateStart === formData.dateEnd &&
                endTime - startTime < 15 * 60 * 1000
            ) {
                toast.error(
                    "A diferença mínima entre a hora de início e a hora de encerramento deve ser de 15 minutos."
                );
                setValidation((prev) => ({ ...prev, timeEnd: false }));
            } else if (
                formData.dateStart !== formData.dateEnd &&
                startTime.getTime() >= endTime.getTime()
            ) {
                toast.error(
                    "A hora de encerramento deve ser posterior à hora de início para o mesmo dia."
                );
                setValidation((prev) => ({ ...prev, timeEnd: false }));
            } else {
                setValidation((prev) => ({ ...prev, timeEnd: true }));
            }
        }
    };

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
            <div className="flex mb-6 flex-col gap-4">
                <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="date-start"
                            className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                        >
                            Data de início
                        </label>
                        <input
                            type="date"
                            name="date-start"
                            id="date-start"
                            onChange={handleDateStartChange}
                            onBlur={validateDateStart}
                            value={formData.dateStart}
                            className={`rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4 ${
                                validation.dateStart === false
                                    ? "border border-red-500 border-spacing-2"
                                    : ""
                            }`}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="time-start"
                            className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                        >
                            Hora de início
                        </label>
                        <input
                            type="time"
                            name="time-start"
                            id="time-start"
                            onChange={handleTimeStartChange}
                            onBlur={validateTimeStart}
                            value={formData.timeStart}
                            className={`rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4 disabled:opacity-75 ${
                                validation.timeStart === false
                                    ? "border border-red-500 border-spacing-2"
                                    : ""
                            }`}
                            disabled={!formData.dateStart}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="date-end"
                            className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                        >
                            Data de encerramento
                        </label>
                        <input
                            type="date"
                            name="date-end"
                            id="date-end"
                            onChange={handleDateEndChange}
                            onBlur={validateDateEnd}
                            value={formData.dateEnd}
                            className={`rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4 ${
                                validation.dateEnd === false
                                    ? "border border-red-500 border-spacing-2"
                                    : ""
                            }`}
                            min={formData.dateStart}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="time-end"
                            className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                        >
                            Hora de encerramento
                        </label>
                        <input
                            type="time"
                            name="time-end"
                            id="time-end"
                            onChange={handleTimeEndChange}
                            onBlur={validateTimeEnd}
                            value={formData.timeEnd}
                            className={`rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4 disabled:opacity-75  ${
                                validation.timeEnd === false
                                    ? "border border-red-500 border-spacing-2"
                                    : ""
                            }`}
                            disabled={
                                !formData.dateEnd ||
                                !formData.dateStart ||
                                !formData.timeStart
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2;
