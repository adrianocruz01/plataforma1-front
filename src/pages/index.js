import { useState, useEffect } from "react";
import Image from "next/image";
import Pencil from "../assets/images/pencil.svg";
import Folder from "../assets/images/folder.svg";
import XMark from "../assets/images/x-mark.svg";
import Trash from "../assets/images/trash.svg";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskImgURL, setNewTaskImgURL] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://treinamento-maker-back-bba33a6c4f46.herokuapp.com/listar-treinamentos"
      );
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const createTask = async () => {
    if (!newTaskText) return;

    try {
      const response = await fetch(
        "https://treinamento-maker-back-bba33a6c4f46.herokuapp.com/novo-treinamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: newTaskText,
            image: newTaskImgURL === "" ? null : newTaskImgURL,
          }),
        }
      );
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTaskText("");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(
        `https://treinamento-maker-back-bba33a6c4f46.herokuapp.com/deletar-treinamento/${taskId}`,
        {
          method: "DELETE",
        }
      );
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const editTask = async (taskId) => {
    if (!newTaskText) return;

    try {
      const response = await fetch(
        `https://treinamento-maker-back-bba33a6c4f46.herokuapp.com/editar-treinamento/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: newTaskText,
            image: newTaskImgURL === "" ? null : newTaskImgURL,
          }),
        }
      );
      const data = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? data : task)));
      setEditingTaskId(null);
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen w-full">
      <div className="px-4 mb-10 max-w-3xl w-full">
        <h1 className="text-2xl font-semibold mt-16 mb-8">Treinamentos</h1>
        <div className="border border-zinc-300 px-10 py-8 flex flex-col rounded-2xl h-fit max-w-4xl min-w-full">
          <div className="flex gap-3 mb-6 flex-col">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Descreva o treinamento"
              className="h-9 rounded-md p-1 focus-visible:outline-none border border-zinc-300 focus-visible:border-zinc-600"
            />
            <input
              type="url"
              value={newTaskImgURL}
              onChange={(e) => setNewTaskImgURL(e.target.value)}
              placeholder="URL da imagem (opicional)"
              className="h-9 rounded-md p-1 focus-visible:outline-none border border-zinc-300 focus-visible:border-zinc-600"
            />
            <button
              className="self-start px-3 py-2 bg-purple-600 text-white rounded-md font-medium shadow"
              onClick={createTask}
            >
              Adicionar treinamento
            </button>
          </div>
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border border-zinc-300 p-4 rounded-md mb-2 last:mb-0 flex justify-between flex-col md:flex-row"
              >
                {editingTaskId === task.id ? (
                  <div className="flex gap-3 flex-col lg:flex-row">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Descreva o novo treinamento"
                      className="h-9 rounded-md p-1 focus-visible:outline-none border border-zinc-300 focus-visible:border-zinc-600"
                    />
                    <input
                      type="url"
                      value={newTaskImgURL}
                      onChange={(e) => setNewTaskImgURL(e.target.value)}
                      placeholder="Nova URL da imagem (opicional)"
                      className="h-9 rounded-md p-1 focus-visible:outline-none border border-zinc-300 focus-visible:border-zinc-600"
                    />
                  </div>
                ) : (
                  <div className="h-9 max-w-sm text-ellipsis overflow-hidden whitespace-nowrap">
                    {task.description}
                  </div>
                )}
                {editingTaskId === task.id ? (
                  <div className="flex gap-1 mt-3">
                    <button
                      className="p-2 rounded-full hover:bg-zinc-200 transition-colors duration-300"
                      onClick={() => editTask(task.id, newTaskText)}
                    >
                      <Image
                        src={Folder}
                        width={18}
                        height={18}
                        style={{ minWidth: "18px" }}
                      />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-zinc-200 transition-colors duration-300"
                      onClick={() => setEditingTaskId(null)}
                    >
                      <Image
                        src={XMark}
                        width={18}
                        height={18}
                        style={{ minWidth: "18px" }}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1 w-max">
                    <button
                      className="p-2 rounded-full hover:bg-zinc-200 transition-colors duration-300"
                      onClick={() => setEditingTaskId(task.id)}
                    >
                      <div>
                        <Image
                          src={Pencil}
                          width={18}
                          height={18}
                          style={{ minWidth: "18px" }}
                        />
                      </div>
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-zinc-200 transition-colors duration-300"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Image
                        src={Trash}
                        width={18}
                        height={18}
                        style={{ minWidth: "18px" }}
                      />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
