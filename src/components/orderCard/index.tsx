import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { baseUrl } from "@/services/api";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

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
  workerId?: {
    _id: string;
    fullName: string;
  };
  imageUrl?: string;
}

interface OrderCardProps {
  job: Job;
  onCancel?: (jobId: string) => void;
}

export const OrderCard = ({ job, onCancel }: OrderCardProps) => {
  const { token } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);

  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg"; // Ajuste o caminho se necessário

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

      toast.success("Pedido editado com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao editar pedido");
    }
  };

  return (
    <li
      className={`bg-white p-4 rounded shadow-md hover:bg-gray-50 transition ${
        jobStatus === "cancelled" || jobStatus === "cancelled-by-client"
          ? "bg-gray-200"
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
            placeholder="Título do Pedido"
          />
          <textarea
            value={editedJob.description}
            onChange={(e) =>
              setEditedJob({ ...editedJob, description: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded"
            placeholder="Descrição do Pedido"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleEditOrder}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Topo: Imagem e Título */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-shrink-0">
              <img
                src={displayImage}
                alt={job.title}
                className="rounded object-cover w-[200px] h-[150px]"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{job.title}</h3>
              <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                <FaInfoCircle className="text-gray-600" />
                {job.description}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          {/* Informações Extras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p className="text-sm text-gray-800">
              <span className="font-bold">Status:</span> {jobStatus}
            </p>
            <p className="text-sm text-gray-800 flex items-center gap-1">
              <MdCalendarToday className="text-gray-600" />
              <span className="font-bold">Data:</span>{" "}
              {dayjs(job.createdAt).format("DD/MM/YYYY")}
            </p>
            {typeof job.price === "number" && (
              <p className="text-sm text-gray-800 flex items-center gap-1">
                <MdAttachMoney className="text-gray-600" />
                <span className="font-bold">Preço:</span> R${" "}
                {job.price.toFixed(2)}
              </p>
            )}
            <p className="text-sm text-gray-800 flex items-start gap-1">
              <MdLocationOn className="text-gray-600 mt-0.5" />
              <span className="font-bold">Local:</span>
              <span>
                Rua {job.location.street}, {job.location.city}/
                {job.location.state}
              </span>
            </p>
          </div>

          {/* Trabalhador */}
          {jobStatus === "in-progress" && job.workerId && (
            <p className="text-sm text-gray-800 mt-2">
              <span className="font-bold">Trabalhador:</span>{" "}
              {job.workerId.fullName}
            </p>
          )}

          {/* Botões de ação */}
          <div className="mt-4 flex justify-end gap-2">
            {jobStatus !== "cancelled" &&
              jobStatus !== "cancelled-by-client" && (
                <button
                  onClick={handleCancelOrder}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                >
                  Cancelar Pedido
                </button>
              )}
            {jobStatus === "cancelled-by-client" && (
              <button
                onClick={handleReactivateOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Reativar Pedido
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
            >
              Editar Pedido
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
