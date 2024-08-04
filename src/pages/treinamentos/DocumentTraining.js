import { useState, useEffect } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";

const DocumentTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [domain, setDomain] = useState("");
    const fileTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    useEffect(() => {
        if (typeof window !== "undefined") {
            const { origin } = window.location;
            setDomain(origin);
        }
    }, []);

    useEffect(() => {
        fetchTrainings();
    }, [trainings]);

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

    const createTraining = async (file) => {
        if (!file || !file.name || !file.type || !file.url) {
            toast.error("Erro ao fazer upload");
            return;
        }

        const payload = {
            type: "DOCUMENT",
            documentUrl: `${domain}${file.url}`,
            documentName: file.name,
            documentMimetype: file.type,
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
            const data = await response.json();
            if (response.ok) {
                toast.success("Treinamento cadastrado!");
                setTrainings([...trainings, data]);
            } else {
                toast.error("Erro ao criar treinamento.");
            }
        } catch (error) {
            console.error("Erro ao criar treinamento:", error);
        }
    };

    return (
        <div className="flex flex-col h-fit w-full bg-neutral-700 rounded-2xl p-8">
            <div className="flex gap-5 mb-6 flex-col">
                <FileUpload
                    onUpload={createTraining}
                    supportedTypes={fileTypes}
                />
            </div>
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
