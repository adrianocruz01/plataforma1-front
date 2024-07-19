import { useState, useEffect } from "react";
import Training from "@/components/Training";

const WebsiteTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [newTrainingWebsite, setNewTrainingWebsite] = useState("");
    const [updateInterval, setUpdateInterval] = useState("NEVER");
    const [subpagesNav, setSubpagesNav] = useState("DISABLED");

    useEffect(() => {
        fetchTrainings();
    }, [trainings]);

    const fetchTrainings = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/affirmations?page=1&pageSize=150&query=&type=WEBSITE`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            setTrainings(data.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const createTraining = async (e) => {
        if (!newTrainingWebsite) return;
        e.target.disabled = true;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/affirmations`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        affirmationType: "WEBSITE",
                        websiteUrl: newTrainingWebsite,
                        trainingSubPages: subpagesNav,
                        trainingInterval: updateInterval,
                    }),
                }
            );
            const data = await response.json();
            setTrainings([...trainings, data]);
            setNewTrainingWebsite("");
            e.target.disabled = false;
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };

    const handleRadio = (e) => {
        if (e.target.checked) setSubpagesNav(e.target.value);
    };

    return (
        <div className="flex flex-col h-fit w-full">
            <div className="flex gap-5 mb-6 flex-col">
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs mb-2 border-l border-orange-600"
                    >
                        Novo treinamento
                    </label>
                    <input
                        id="new-training"
                        type="text"
                        value={newTrainingWebsite}
                        onChange={(e) => setNewTrainingWebsite(e.target.value)}
                        placeholder="Insira a URL de um site"
                        className="rounded-md p-3 focus-visible:outline-none border bg-white border-neutral-100 focus-visible:border-neutral-300"
                    />
                </div>
                <div className="flex gap-5">
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="update"
                            className="pl-2 text-xs mb-2 border-l border-orange-600"
                        >
                            Intervalo de atualização
                        </label>
                        <select
                            name="update"
                            id="update"
                            value={updateInterval}
                            className="rounded-md p-3 focus-visible:outline-none border bg-white border-neutral-100 focus-visible:border-neutral-300"
                            onChange={(e) => setUpdateInterval(e.target.value)}
                        >
                            <option value="NEVER">Nunca</option>
                            <option value="ONE_HOUR">1 hora</option>
                            <option value="FOUR_HOUR">4 horas</option>
                            <option value="EIGHT_HOUR">8 horas</option>
                            <option value="TWELVE_HOUR">12 horas</option>
                            <option value="ONE_DAY">1 dia</option>
                            <option value="ONE_WEEK">1 semana</option>
                            <option value="ONE_MONTH">1 mês</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="subpages"
                            className="pl-2 text-xs mb-2 border-l border-orange-600"
                        >
                            Permitir navegar em subpáginas
                        </label>
                        <div className="flex items-center">
                            <input
                                className="mr-1"
                                type="radio"
                                name="subpages"
                                id="no"
                                value="DISABLED"
                                checked={subpagesNav === "DISABLED"}
                                onChange={(e) => handleRadio(e)}
                            />
                            <label className="mr-3" htmlFor="no">Não</label>
                            <input
                                className="mr-1"
                                type="radio"
                                name="subpages"
                                id="yes"
                                value="ACTIVE"
                                checked={subpagesNav === "ACTIVE"}
                                onChange={(e) => handleRadio(e)}
                            />
                            <label className="mr-3" htmlFor="yes">
                                Sim
                            </label>
                        </div>
                    </div>
                </div>
                <button
                    className="self-end px-3 py-2 bg-sky-600 text-white rounded-md font-medium shadow"
                    onClick={(e) => createTraining(e)}
                >
                    Cadastrar
                </button>
            </div>
            <div>
                {trainings.map((training, index) => (
                    <Training
                        training={training}
                        trainings={trainings}
                        setTrainings={setTrainings}
                        type={"website"}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default WebsiteTraining;
