import { useEffect, useState, type FormEvent } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import type { Task } from "./types/Task";
import "./App.css";
import api from "./service/api";

function App() {
  const [task, setTask] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [status, setStatus] = useState("PENDENTE");

  const loadTasks = () => {
    api.get("/tasks").then((response) => {
      setTask(response.data);
    });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dataFormat = new Date(finalDate).toISOString();

    if (editTaskId) {
      api
        .put(`/tasks/${editTaskId}`, {
          title,
          description,
          finalDate: dataFormat,
          status: status,
        })
        .then(() => {
          loadTasks();
          setTitle("");
          setDescription("");
          setFinalDate("");
          setEditTaskId(null);
        });
    } else {
      api
        .post("/tasks", {
          title,
          description,
          finalDate: dataFormat,
        })
        .then(() => {
          loadTasks();
          setTitle("");
          setDescription("");
          setFinalDate("");
          setEditTaskId(null);
        });
    }
  };

  const handleDeleteTask = (id: number) => {
    api.delete(`/tasks/${id}`).then(() => {
      loadTasks();
    });
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.taskId);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);

    if (task.finalDate) {
      setFinalDate(task.finalDate.slice(0, 16));
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "status-pendente";
      case "EM_ANDAMENTO":
        return "status-andamento";
      case "CONCLUIDO":
        return "status-concluido";
      case "EXPIRADO":
        return "status-expirado";
    }
  };

  return (
    <>
      <h1>To-Do List</h1>
      <div className="container">
        <form action="" onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Titulo da tarafa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Descrição da tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <input
            type="datetime-local"
            placeholder="Até que dia precisa ser concluido?"
            value={finalDate}
            onChange={(e) => setFinalDate(e.target.value)}
          />
          {editTaskId && (
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="EXPIRADO">Expirado</option>
            </select>
          )}
          <button type="submit">
            {editTaskId ? "Atualizar Tarefa" : "Criar Tarefa"}
          </button>
        </form>

        <div className="task-list">
          {task.map((t) => {
            return (
              <div key={t.taskId} className="task-card">
                <h3>{t.title}</h3>
                <span className={`status-badge ${statusColor(t.status)}`}>
                  Status: {t.status}
                </span>
                <p>{t.description}</p>
                <div className="task-btn">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(t.taskId)}
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="update-btn"
                    onClick={() => handleEditTask(t)}
                  >
                    <FaPencilAlt />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
