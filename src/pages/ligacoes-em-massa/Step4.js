import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Step4 = ({ formData, setFormData, validateStep }) => {
    const [smsText, setSMSText] = useState("");
    const [smsAction, setSMSAction] = useState("");

    useEffect(() => {
        if (smsText && smsAction) {
            setFormData({ ...formData, smsText: smsText });
            setFormData({ ...formData, smsAction: smsAction });
        }
    }, [smsText, smsAction]);

    useEffect(() => {
        if (formData.smsText && formData.smsAction) {
            validateStep(true);
        } else if (!formData.smsText && !formData.smsAction) {
            validateStep(true);
        } else {
            validateStep(false);
        }
    }, [formData]);

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex mb-6 flex-col">
                <label
                    htmlFor="sms-text"
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Texto do SMS
                </label>
                <textarea
                    id="sms-text"
                    wrap="hard"
                    rows="2"
                    type="text"
                    maxLength={160}
                    value={smsText}
                    onChange={(e) => setSMSText(e.target.value)}
                    placeholder="Descreva o treinamento"
                    className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white mb-4"
                />
                <label
                    htmlFor="sms-action"
                    className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                >
                    Ações do SMS
                </label>
                <select
                    name="sms-action"
                    id="sms-action"
                    value={smsAction}
                    className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    onChange={(e) => setSMSAction(e.target.value)}
                >
                    <option value="">Escolha uma opção</option>
                    <option value="ok">
                        Envia SMS para os destinos que atenderam
                    </option>
                    <option value="nae">
                        Envia SMS para os que não atenderam
                    </option>
                    <option value="oknae">
                        Envia SMS para os que atenderam e não atenderam
                    </option>
                </select>
            </div>
        </div>
    );
};

export default Step4;
