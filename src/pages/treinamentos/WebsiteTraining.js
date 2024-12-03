import { useState, useEffect } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";

const WebsiteTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [newTrainingWebsite, setNewTrainingWebsite] = useState("");
    const [updateInterval, setUpdateInterval] = useState("NEVER");
    const [subpagesNav, setSubpagesNav] = useState("DISABLED");

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            // Pegando o ID e token do GPT Maker do localStorage
            const cliente = JSON.parse(localStorage.getItem("cliente"));
            const gptMakeId = cliente.gptMake.id;
            const gptMakeToken = cliente.gptMake.token;

            const response = await fetch(
                `/api/trainings/agent/${gptMakeId}?type=WEBSITE`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${gptMakeToken}`,
                    },
                }
            );

            const data = await response.json();
            setTrainings(data.data);
        } catch (error) {
            console.error("Erro ao buscar treinamentos:", error);
        }
    };

    const createTraining = async (e) => {
        if (!newTrainingWebsite) {
            toast.error("O campo 'Novo treinamento' não pode ser vazio!");
            return;
        }
        e.target.disabled = true;

        // Pegando o ID e token do GPT Maker do localStorage
        const cliente = JSON.parse(localStorage.getItem("cliente"));
        const gptMakeId = cliente.gptMake.id;
        const gptMakeToken = cliente.gptMake.token;

        const payload = {
            type: "WEBSITE",
            website: newTrainingWebsite,
            trainingSubPages: subpagesNav,
            trainingInterval: updateInterval,
        };

        try {
            const response = await fetch(
                `http://localhost:3001/api/trainings/agent/${gptMakeId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${gptMakeToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (response.ok) {
                toast.success("Treinamento cadastrado!");
                setTrainings([...trainings, data]);
                setNewTrainingWebsite("");
            } else {
                toast.error("Erro ao criar treinamento.");
            }
            e.target.disabled = false;
        } catch (error) {
            console.error("Erro ao criar treinamento:", error);
        }
    };

    const handleRadio = (e) => {
        if (e.target.checked) setSubpagesNav(e.target.value);
    };

    return (
        <div className="flex flex-col h-fit w-full bg-neutral-700 rounded-2xl p-8">
            <div className="flex gap-5 mb-6 flex-col">
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training"
                        className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                    >
                        Novo treinamento
                    </label>
                    <input
                        id="new-training"
                        type="text"
                        value={newTrainingWebsite}
                        onChange={(e) => setNewTrainingWebsite(e.target.value)}
                        placeholder="Insira a URL de um site"
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                </div>
                <div className="flex gap-5">
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="update"
                            className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                        >
                            Intervalo de atualização
                        </label>
                        <select
                            name="update"
                            id="update"
                            value={updateInterval}
                            className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
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
                            className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
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
                            <label
                                className="mr-3 text-neutral-100"
                                htmlFor="no"
                            >
                                Não
                            </label>
                            <input
                                className="mr-1"
                                type="radio"
                                name="subpages"
                                id="yes"
                                value="ACTIVE"
                                checked={subpagesNav === "ACTIVE"}
                                onChange={(e) => handleRadio(e)}
                            />
                            <label
                                className="mr-3 text-neutral-100"
                                htmlFor="yes"
                            >
                                Sim
                            </label>
                        </div>
                    </div>
                </div>
                <button
                    className="self-end px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
                    onClick={(e) => createTraining(e)}
                >
                    Cadastrar
                </button>
            </div>
            <div className="mt-8">
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
