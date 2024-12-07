import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

import { baseUrl } from "@/services/api";
interface Job {
  _id: string;
  title: string;
  price?: number;
  description: string;
  status: string;
  createdAt: string;
  location: {
    cep: string;
    street: string;
    city: string;
    state: string;
  };
  workerId?: string;
  workerName?: string;
}

interface OrderCardProps {
  job: Job;
  onCancel?: (jobId: string) => void;
}

export const OrderCard = ({ job, onCancel }: OrderCardProps) => {
  const { token, user } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);
  const [jobWorkerId, setJobWorkerId] = useState(job.workerId);
  const [workerName, setWorkerName] = useState(job.workerName);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);

  useEffect(() => {
    setJobStatus(job.status);
    setJobWorkerId(job.workerId);
    setWorkerName(job.workerName);
  }, [job]);

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/cancel-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao cancelar pedido");
      }

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      setJobWorkerId(updatedJob.workerId);
      setWorkerName(updatedJob.workerName);

      toast.success("Pedido cancelado com sucesso!");
      onCancel && onCancel(job._id);
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar pedido");
    }
  };

  const handleReactivateOrder = async () => {
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/reactivate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao reativar pedido");
      }

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      setJobWorkerId(updatedJob.workerId);
      setWorkerName(updatedJob.workerName);

      toast.success("Pedido reativado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao reativar pedido");
    }
  };

  const handleEditOrder = async () => {
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedJob),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao editar pedido");
      }

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      setJobWorkerId(updatedJob.workerId);
      setWorkerName(updatedJob.workerName);

      toast.success("Pedido editado com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao editar pedido");
    }
  };

  return (
    <li
      className={`bg-white p-4 rounded shadow-md hover:bg-gray-300 ${
        jobStatus === "cancelled" || jobStatus === "cancelled-by-client"
          ? "bg-gray-400"
          : ""
      }`}
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedJob.title}
            onChange={(e) =>
              setEditedJob({ ...editedJob, title: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={editedJob.description}
            onChange={(e) =>
              setEditedJob({ ...editedJob, description: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleEditOrder}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Salvar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2 ml-2"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold">{job.title}</h3>
          <p>{job.description}</p>
          <p>Status: {jobStatus}</p>
          <>Preço : R$ {job.price}</>
          <p>Criado em: {dayjs(job.createdAt).format("DD/MM/YYYY")}</p>
          <p>
            Endereço:
            <span className="font-semibold">
              {" "}
              Rua: {job.location.street}, Cidade: {job.location.city}, Estado:{" "}
              {job.location.state}
            </span>
          </p>
          {jobStatus === "in-progress" && workerName && (
            <p>Trabalhador: {workerName}</p>
          )}
          {jobStatus !== "cancelled" && jobStatus !== "cancelled-by-client" && (
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              Cancelar Pedido
            </button>
          )}
          {jobStatus === "cancelled-by-client" && (
            <button
              onClick={handleReactivateOrder}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 ml-2"
            >
              Reativar Pedido
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-2 ml-2"
          >
            Editar Pedido
          </button>
        </div>
      )}
    </li>
  );
};
