import { useState, useEffect } from "react";
import Training from "@/components/Training";
import { toast } from "react-toastify";

const TextTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [newTrainingText, setNewTrainingText] = useState("");
    const [newTrainingImgURL, setNewTrainingImgURL] = useState("");

    useEffect(() => {
        fetchTrainings(); // Busca os treinamentos ao carregar o componente
    }, []);

    const fetchTrainings = async () => {
        try {
            const storageData = JSON.parse(localStorage.getItem('user'));
            // console.log('aqqqqqqqqqqqqqqqqqqqqqqqqqqq',storageData) // Certifique-se de que está usando a chave correta
            if (!storageData.cliente) {
                toast.error("Dados do cliente não encontrados no local storage.");
                return;
            }

            const gptMakeId = storageData.cliente.gptMake.id;
            const gptMakeToken = storageData.cliente.gptMake.token;
            const authlogin = storageData.token;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_DEV}/api/treinos/agent/${gptMakeId}/text-trainings?pageSize=1000&page=2`, {
                method: "GET",
                headers: {
                    "Authorization": authlogin,
                    "gptMakeToken": gptMakeToken,
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrainings(data.data);
            } else {
                toast.error("Erro ao buscar treinamentos. Verifique as permissões.");
            }
        } catch (error) {
            console.error("Erro ao buscar treinamentos:", error);
            toast.error("Erro ao buscar treinamentos.");    
        }
    };

    const createTraining = async (e) => {
        if (!newTrainingText) {
            toast.error("O campo 'Novo treinamento' não pode ser vazio!");
            return;
        }
        e.target.disabled = true;

        try {
            const storageData = JSON.parse(localStorage.getItem('user'));
            // console.log('aqqqqqqqqqqqqqqqqqqqqqqqqqqq',storageData) // Certifique-se de que está usando a chave correta
            if (!storageData.cliente) {
                toast.error("Dados do cliente não encontrados no local storage.");
                return;
            }

            const gptMakeId = storageData.cliente.gptMake.id;
            const gptMakeToken = storageData.cliente.gptMake.token;
            const authlogin = storageData.token;

            const payload = {
                type: "TEXT",
                text: newTrainingText.trim(),
            };
            // console.log(payload)

            if (newTrainingImgURL) {
                payload.image = newTrainingImgURL;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_DEV}/api/treinos/agent/${gptMakeId}/create-trainings`, {
                method: "POST",
                headers: {
                    "Authorization": authlogin,
                    "gptMakeToken": gptMakeToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log('retorno do envio do treinamento:' ,response)

            if (response.ok) {
                const data = await response.json();
                toast.success("Treinamento cadastrado!");
                setNewTrainingText("");
                setNewTrainingImgURL("");
                fetchTrainings()
            } else {
                toast.error("Erro ao criar treinamento.");
            }
        } catch (error) {
            console.error("Erro ao criar treinamento:", error);
            toast.error("Erro ao criar treinamento.");
        } finally {
            e.target.disabled = false;
        }
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
                    <textarea
                        id="new-training"
                        wrap="hard"
                        rows="5"
                        type="text"
                        value={newTrainingText}
                        onChange={(e) => setNewTrainingText(e.target.value)}
                        placeholder="Descreva o treinamento"
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="new-training-image"
                        className="pl-2 text-xs text-neutral-100 mb-2 border-l-2 border-cyan-600"
                    >
                        Adicione uma imagem (URL)
                    </label>
                    <input
                        id="new-training-image"
                        type="url"
                        value={newTrainingImgURL}
                        onChange={(e) => setNewTrainingImgURL(e.target.value)}
                        placeholder="URL da imagem (opcional)"
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                </div>
                <button
                    className="self-end px-3 py-2 button-gradient before:rounded-lg text-white rounded-md font-bold shadow"
                    onClick={(e) => createTraining(e)}
                >
                    Cadastrar
                </button>
            </div>
            <div className="mt-8">
                {trainings.length > 0 ? (
                    trainings.map((training, index) => (
                        <Training
                            training={training}
                            trainings={trainings}
                            setTrainings={setTrainings}
                            type={"text"}
                            key={index}
                        />
                    ))
                ) : (
                    <p className="text-white">Nenhum treinamento disponível.</p>
                )}
            </div>
        </div>
    );
};

export default TextTraining;
