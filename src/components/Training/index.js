const { useState, useEffect, useRef } = require("react");
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { toast } from "react-toastify";

const Training = ({ training, trainings, setTrainings, type }) => {
    const [editingTrainingId, setEditingTrainingId] = useState(null);
    const [editingTrainingText, setEditingTrainingText] = useState("");
    const [editingTrainingImgURL, setEditingTrainingImgURL] = useState("");
    const [editMenu, setEditMenu] = useState(false);
    let trainingInfo = "";

    switch (type) {
        case "text":
            trainingInfo = training.text;
            break;
        case "website":
            trainingInfo = training.website;
            break;
        case "document":
            trainingInfo = training.documentName;
            break;
    }

    const handleMenu = () => {
        setEditMenu(!editMenu);
    };

    const editMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                editMenuRef.current &&
                !editMenuRef.current.contains(event.target)
            ) {
                setEditMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const editTraining = async (trainingId) => {

        const storageData = JSON.parse(localStorage.getItem('user'));
        // console.log('aqqqqqqqqqqqqqqqqqqqqqqqqqqq',storageData) // Certifique-se de que está usando a chave correta
        if (!storageData.cliente) {
            toast.error("Dados do cliente não encontrados no local storage.");
            return;
        }

        const gptMakeToken = storageData.cliente.gptMake.token;
        const authlogin = storageData.token;

        if (!editingTrainingText) {
            toast.error(
                "O campo de descrição do treinamento não pode ser vazio!"
            );
            return;
        }
        setEditMenu(false);
        try {
            const payload = {
                type: "TEXT",
                text: editingTrainingText,
            };

            if (editingTrainingImgURL) {
                payload.image = editingTrainingImgURL;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL_DEV}/api/treinos/agent/${trainingId}/edit-training`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": authlogin,
                        "gptMakeToken": gptMakeToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (response.ok) {
                toast.success("Treinamento atualizado!");
                setTrainings(
                    trainings.map((training) =>
                        training.id === trainingId ? data : training
                    )
                );
                setEditingTrainingId(null);
                setEditingTrainingText("");
                setEditingTrainingImgURL("");
            } else {
                toast.error("Erro ao editar treinamento.");
            }
        } catch (error) {
            console.error("Erro ao editar treinamento:", error);
        }
    };

    const deleteTraining = async (trainingId) => {

        const storageData = JSON.parse(localStorage.getItem('user'));
        // console.log('aqqqqqqqqqqqqqqqqqqqqqqqqqqq',storageData) // Certifique-se de que está usando a chave correta
        if (!storageData.cliente) {
            toast.error("Dados do cliente não encontrados no local storage.");
            return;
        }

        const gptMakeId = storageData.cliente.gptMake.id;
        const gptMakeToken = storageData.cliente.gptMake.token;
        const authlogin = storageData.token;
        setEditMenu(false);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL_DEV}/api/treinos/agent/${trainingId}/delete-training`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": authlogin,
                        "gptMakeToken": gptMakeToken,
                    }
                },
            );
            if (response.ok) {
                toast.success('Treinamento excluído!')
                const remainingTraining = trainings.filter((training) => training.id !== trainingId);
                setTrainings(remainingTraining);
            } else {
                toast.success('Erro ao excluir treinamento!')
            }
        } catch (error) {
            console.error("Erro ao deletar treinamento:", error);
        }
    };

    const editingTraining = (trainingId) => {
        setEditingTrainingId(trainingId);
        const editedTraining = trainings.find(
            (training) => training.id === trainingId
        );
        setEditingTrainingText(editedTraining.text);
        setEditingTrainingImgURL(editedTraining.image);
    };

    const handleCancel = () => {
        setEditingTrainingId(null);
        setEditMenu(false);
    };

    return (
        <div
            key={training.id}
            className={`gradient-container text-white transition-shadow shadow hover:shadow-lg p-5 rounded-md mb-5 last:mb-0 flex justify-between ${
                editingTrainingId ? "flex-col md:flex-row" : ""
            }`}
        >
            {editingTrainingId === training.id && type === "text" ? (
                <div className="flex gap-3 flex-col w-full">
                    <textarea
                        wrap="hard"
                        rows="5"
                        type="text"
                        value={editingTrainingText}
                        onChange={(e) => setEditingTrainingText(e.target.value)}
                        placeholder="Descreva o novo treinamento"
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                    <input
                        type="url"
                        value={editingTrainingImgURL}
                        onChange={(e) =>
                            setEditingTrainingImgURL(e.target.value)
                        }
                        placeholder="Nova URL da imagem (opcional)"
                        className="rounded-md p-3 focus-visible:outline-none bg-neutral-900 text-white"
                    />
                </div>
            ) : (
                <div className="flex-grow whitespace-normal overflow-wrap-anywhere">
                    {trainingInfo}
                </div>
            )}
            {editingTrainingId === training.id && type === "text" ? (
                <div className="flex gap-2 mt-3 md:mt-0 md:ml-3 md:flex-col">
                    <button
                        className="p-2 flex flex-col items-center rounded-full transition-colors duration-300 text-green-600"
                        onClick={() =>
                            editTraining(training.id, editingTrainingText)
                        }
                        title="Salvar"
                    >
                        <CheckOutlinedIcon fontSize="small" />
                        <span className="text-xs">Salvar</span>
                    </button>
                    <button
                        className="p-2 flex flex-col items-center rounded-full transition-colors duration-300 text-yellow-600"
                        onClick={handleCancel}
                        title="Cancelar"
                    >
                        <CloseOutlinedIcon />
                        <span className="text-xs">Cancelar</span>
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <button onClick={handleMenu}>
                        <MoreVertOutlinedIcon />
                    </button>
                    <div
                        className={`flex flex-col absolute bg-neutral-700 shadow rounded z-10 gradient-container ${
                            editMenu ? "flex" : "hidden"
                        }`}
                        ref={editMenuRef}
                    >
                        <button
                            className={`py-3 px-4 flex items-center transition-colors duration-300 text-blue-400 hover:bg-neutral-600  ${
                                type === "text" ? "flex" : "hidden"
                            }`}
                            onClick={() => editingTraining(training.id)}
                            title="Editar"
                        >
                            <EditOutlinedIcon fontSize="small" />
                            <span className="text-xs ml-1">Editar</span>
                        </button>
                        <button
                            className="py-3 px-4 flex items-center transition-colors duration-300 text-red-400 hover:bg-neutral-600 "
                            onClick={() => deleteTraining(training.id)}
                            title="Excluir"
                        >
                            <DeleteOutlinedIcon fontSize="small" />
                            <span className="text-xs ml-1">Excluir</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Training;
