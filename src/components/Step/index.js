import { useState } from "react";
import {
    ArrowBackIosNewOutlined,
    ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const Step = ({ steps, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const lastStep = steps.length - 1;

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentStep < lastStep && steps[currentStep]?.validation) {
            setCurrentStep((prev) => prev + 1);
        }
        if (!steps[currentStep]?.validation) {
            toast.error("Verifique se todos os campos estão preenchidos corretamente.");
        }
    };

    return (
        <div>
            <h2 className="font-semibold text-2xl mb-6 text-neutral-200">{steps[currentStep]?.title}</h2>
            {steps[currentStep]?.content}
            <div className="flex justify-between mt-10">
                <button
                    disabled={currentStep === 0}
                    onClick={handlePrev}
                    className="mr-auto px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow disabled:hidden"
                >
                    <ArrowBackIosNewOutlined />
                    Voltar
                </button>
                <button
                    disabled={currentStep === lastStep}
                    onClick={handleNext}
                    className="ml-auto px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow disabled:hidden"
                >
                    Próximo
                    <ArrowForwardIosOutlined />
                </button>
                {onSubmit && (
                    <button
                        disabled={currentStep !== lastStep}
                        onClick={onSubmit}
                        className="ml-auto px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow disabled:hidden"
                    >
                        Enviar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Step;
