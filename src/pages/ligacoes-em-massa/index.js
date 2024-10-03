import { ToastContainer, Bounce, toast } from "react-toastify";
import Step from "@/components/Step";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { useState } from "react";

const MassCallsPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        file: null,
        dateStart: "",
        dateEnd: "",
        timeStart: "",
        timeEnd: "",
        audioName: "",
        smsText: "",
        smsAction: "",
    });

    const [step1Validation, setStep1Validation] = useState(false);
    const [step2Validation, setStep2Validation] = useState(false);
    const [step3Validation, setStep3Validation] = useState(false);
    const [step4Validation, setStep4Validation] = useState(false);

    const steps = [
        {
            title: "Passo 1:",
            content: (
                <Step1
                    formData={formData}
                    setFormData={setFormData}
                    validateStep={setStep1Validation}
                />
            ),
            validation: step1Validation,
        },
        {
            title: "Passo 2:",
            content: (
                <Step2
                    formData={formData}
                    setFormData={setFormData}
                    validateStep={setStep2Validation}
                />
            ),
            validation: step2Validation,
        },
        {
            title: "Passo 3:",
            content: (
                <Step3
                    formData={formData}
                    setFormData={setFormData}
                    validateStep={setStep3Validation}
                />
            ),
            validation: step3Validation,
        },
        {
            title: "Passo 4:",
            content: (
                <Step4
                    formData={formData}
                    setFormData={setFormData}
                    validateStep={setStep4Validation}
                />
            ),
            validation: step4Validation,
        },
        {
            title: "Resumo",
            content: (
                <Step5
                    formData={formData}
                    setFormData={setFormData}
                    validateStep={setStep4Validation}
                />
            ),
            validation: step4Validation,
        },
    ];

    const handleSubmit = async () => {
        if (
            !formData.name ||
            !formData.content ||
            !formData.dateStart ||
            !formData.dateEnd ||
            !formData.timeStart ||
            !formData.timeEnd ||
            !formData.file
        ) {
            console.log({
                formData
            })
            toast.error("Verifique se todos os campos foram devidamente preenchidos!")
            return;
        }

        const form = new FormData();
        form.append("name", formData.name);
        form.append("content", formData.content);
        form.append("date_start", formData.dateStart);
        form.append("date_end", formData.dateEnd);
        form.append("time_start", formData.timeStart);
        form.append("time_end", formData.timeEnd);
        form.append("file", formData.file);
        
        if (formData.smsText && formData.smsAction) {
            form.append("sms_text", formData.smsText);
            form.append("sms_action", formData.smsAction);
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL_API}/campaign/create-campaign-mass`,
                {
                    method: "POST",
                    body: form,
                }
            );

            if (response.ok) {
                toast.success("Disparo cadastrado com sucesso!");
            } else {
                toast.error("Erro ao criar disparo.");
            }
        } catch (error) {
            toast.error("Erro ao criar disparo.");
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row lg:pl-20">
            <div className="px-6 md:px-10 w-full bg-animate">
                <h1 className="text-3xl font-bold mt-16 mb-8 audiowide text-white">
                    Disparo de ligações em massa
                </h1>
                <div className="max-w-5xl">
                    <div className="bg-neutral-700 rounded-2xl shadow-lg p-8">
                        <Step steps={steps} onSubmit={handleSubmit} />
                        <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                            transition={Bounce}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MassCallsPage;
