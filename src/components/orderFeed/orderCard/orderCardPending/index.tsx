// components/orderFeed/orderCard/OrderCardPending.tsx

import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { baseUrl } from "@/services/api";
import {
  MdLocationOn,
  MdCalendarToday,
  MdAttachMoney,
  MdCancel,
} from "react-icons/md";
import { FaInfoCircle, FaEdit } from "react-icons/fa";

interface Job {
  _id: string;
  title: string;
  price?: number;
  description: string;
  status: string;
  createdAt: string;
  isRated?: boolean;
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
  cleanedPhoto?: string;
  completedAt?: string;
  disputeUntil?: string;
}

interface OrderCardPendingProps {
  job: Job;
  onJobUpdate?: (updatedJob: Job) => void;
}

export const OrderCardPending = ({
  job,
  onJobUpdate,
}: OrderCardPendingProps) => {
  const { token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);

  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg";

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

      const updatedJob: Job = await res.json();
      toast.success("Pedido cancelado com sucesso!");
      onJobUpdate && onJobUpdate(updatedJob);
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar pedido");
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

      const updatedJob: Job = await res.json();
      toast.success("Pedido editado com sucesso!");
      setIsEditing(false);
      onJobUpdate && onJobUpdate(updatedJob);
    } catch (error: any) {
      toast.error(error.message || "Erro ao editar pedido");
    }
  };

  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-50 transition">
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
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 flex items-center gap-1"
            >
              <FaEdit /> Salvar
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
              <span className="font-bold">Status:</span> {job.status}
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

          {/* Botões de Ação */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center gap-1"
            >
              <MdCancel /> Cancelar Pedido
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 flex items-center gap-1"
            >
              Editar Pedido
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
