// components/orderFeed/orderCard/OrderCardInProgress.tsx

import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { baseUrl } from "@/services/api";
import {
  MdLocationOn,
  MdCalendarToday,
  MdAttachMoney,
  MdCancel,
} from "react-icons/md";
import { FaInfoCircle, FaStar } from "react-icons/fa";

interface Rating {
  rating: number;
  comment: string;
  createdAt: string;
}

interface Worker {
  _id: string;
  fullName: string;
  avatars?: { path: string; uploadedAt: string }[];
  ratings?: Rating[];
  averageRating?: number;
}

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
  workerId?: Worker; // Agora assumindo que o workerId vem populado com details
  imageUrl?: string;
  cleanedPhoto?: string;
  completedAt?: string;
  disputeUntil?: string;
}

interface OrderCardInProgressProps {
  job: Job;
  onJobUpdate?: (updatedJob: Job) => void;
}

export const OrderCardInProgress = ({
  job,
  onJobUpdate,
}: OrderCardInProgressProps) => {
  const { token } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);

  // Cálculo do avatar do trabalhador
  const workerAvatar =
    job.workerId?.avatars && job.workerId.avatars.length > 0
      ? `${baseUrl}/uploads/${
          job.workerId.avatars[job.workerId.avatars.length - 1].path
        }`
      : "/assets/imgs/avatarPlaceholder.jpg";

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
      setJobStatus(updatedJob.status);
      toast.success("Pedido cancelado com sucesso!");
      onJobUpdate && onJobUpdate(updatedJob);
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar pedido");
    }
  };

  // Cálculo de estrelas
  const averageRating = job.workerId?.averageRating || 0;
  const maxStars = 5;
  const starElements = [];
  for (let i = 1; i <= maxStars; i++) {
    starElements.push(
      <FaStar
        key={i}
        className={i <= averageRating ? "text-yellow-400" : "text-gray-300"}
      />
    );
  }

  // Comentários recentes
  const recentComments = job.workerId?.ratings
    ? [...job.workerId.ratings]
        .sort((a, b) => {
          // ordenar por data mais recente primeiro
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .slice(0, 3)
    : [];

  const workerAvatars = job.workerId?.avatars || [];
  const latestAvatar =
    workerAvatars.length > 0
      ? workerAvatars[workerAvatars.length - 1].path
      : null;

  const workerAvatarUrl = latestAvatar
    ? `${baseUrl}/uploads/${latestAvatar}`
    : "/assets/imgs/avatarPlaceholder.jpg";

  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-50 transition">
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
            <span className="font-bold">Preço:</span> R$ {job.price.toFixed(2)}
          </p>
        )}
        <p className="text-sm text-gray-800 flex items-start gap-1">
          <MdLocationOn className="text-gray-600 mt-0.5" />
          <span className="font-bold">Local:</span>
          <span>
            Rua {job.location.street}, {job.location.city}/{job.location.state}
          </span>
        </p>
      </div>

      <hr className="my-3" />

      {/* Info do Trabalhador */}
      {job.workerId && (
        <div className="mt-3">
          <h4 className="text-lg font-bold mb-2">Trabalhador Asignado:</h4>
          <div className="flex items-center gap-3">
            <img
              src={workerAvatarUrl}
              alt={job.workerId?.fullName || "Trabalhador"}
              className="w-16 h-16 rounded-[8px] object-cover border border-green-600"
            />
            <div>
              <p className="font-medium text-gray-800">
                {job.workerId.fullName}
              </p>
              <div className="flex items-center gap-1">
                {starElements}
                <span className="text-xs text-gray-500 ml-2">
                  {averageRating.toFixed(1)} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Comentários recentes */}
          {recentComments && recentComments.length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-semibold mb-1">
                Comentários Recentes:
              </h5>
              <ul className="space-y-1">
                {recentComments.map((comment, idx) => (
                  <li key={idx} className="text-xs text-gray-600 italic">
                    {comment.comment}
                    {dayjs(comment.createdAt).format("DD/MM/YYYY")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleCancelOrder}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center gap-1"
        >
          <MdCancel /> Cancelar Pedido
        </button>
      </div>
    </li>
  );
};
