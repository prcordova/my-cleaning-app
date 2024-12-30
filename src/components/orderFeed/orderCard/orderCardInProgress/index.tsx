// components/orderFeed/orderCard/OrderCardInProgress.tsx

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
  workerId?: Worker;
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
  const [showComments, setShowComments] = useState(false);

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
      if (onJobUpdate) {
        onJobUpdate(updatedJob);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar pedido");
    }
  };

  // Avatar do Trabalhador
  const workerAvatars = job.workerId?.avatars || [];
  const latestAvatar =
    workerAvatars.length > 0
      ? workerAvatars[workerAvatars.length - 1].path
      : null;
  const workerAvatarUrl = latestAvatar
    ? `${baseUrl}/uploads/${latestAvatar}`
    : "/assets/imgs/avatarPlaceholder.jpg";

  // Comentários recentes (últimos 3)
  const recentComments = job.workerId?.ratings
    ? [...job.workerId.ratings]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3)
    : [];

  const averageRatingValue = job.workerId?.averageRating;
  const averageRatingText = averageRatingValue?.toFixed(1);

  // Cálculo de estrelas (média do trabalhador)
  const maxStars = 5;
  const workerStarElements = [];
  for (let i = 1; i <= maxStars; i++) {
    workerStarElements.push(
      <FaStar
        key={i}
        className={
          i <= averageRatingValue
            ? "text-yellow-400 text-base"
            : "text-gray-300 text-base"
        }
      />
    );
  }

  // Função para renderizar estrelas de avaliação de um comentário
  const renderCommentStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <FaStar
          key={i}
          className={
            i <= rating ? "text-yellow-400 text-sm" : "text-gray-300 text-sm"
          }
        />
      );
    }
    return <span className="flex items-center gap-1">{stars}</span>;
  };

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
          <h3 className="text-xl font-bold mb-1 break-words">{job.title}</h3>
          <p className="text-sm text-gray-700 mb-2 flex items-center gap-1 break-words">
            <FaInfoCircle className="text-gray-600" />
            {job.description}
          </p>
        </div>
      </div>

      <hr className="my-3" />

      {/* Informações Extras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <p className="text-sm text-gray-800 break-words">
          <span className="font-bold">Status:</span> {jobStatus}
        </p>
        <p className="text-sm text-gray-800 flex items-center gap-1 break-words">
          <MdCalendarToday className="text-gray-600" />
          <span className="font-bold">Data:</span>{" "}
          {dayjs(job.createdAt).format("DD/MM/YYYY")}
        </p>
        {typeof job.price === "number" && (
          <p className="text-sm text-gray-800 flex items-center gap-1 break-words">
            <MdAttachMoney className="text-gray-600" />
            <span className="font-bold">Preço:</span> R$ {job.price?.toFixed(2)}
          </p>
        )}
        <p className="text-sm text-gray-800 flex items-start gap-1 break-words">
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
          <h4 className="text-lg font-bold mb-4">Trabalhador Asignado:</h4>
          <div className="flex items-center gap-4">
            <img
              src={workerAvatarUrl}
              alt={job.workerId.fullName || "Trabalhador"}
              className="w-16 h-16 rounded-[8px] object-cover border border-green-600"
            />
            <div className="flex flex-col">
              <p className="font-medium text-gray-800 break-words">
                {job.workerId.fullName}
              </p>
              <div
                className="flex items-center gap-1 cursor-pointer mt-1"
                onClick={() => setShowComments((prev) => !prev)}
                title="Clique para ver/ocultar comentários"
              >
                {workerStarElements}
                <span className="text-xs text-gray-500 ml-2">
                  {averageRatingText}
                </span>
              </div>
            </div>
          </div>

          {/* Comentários recentes, mostrados apenas quando showComments é true */}
          {showComments && recentComments && recentComments.length > 0 && (
            <div className="mt-4 bg-gray-50 p-3 rounded space-y-3 overflow-hidden">
              <h5 className="text-sm font-semibold text-gray-700 break-words">
                Comentários Recentes:
              </h5>
              <ul className="space-y-3">
                {recentComments.map((comment, idx) => (
                  <li
                    key={idx}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200 flex flex-col gap-2 break-words"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {renderCommentStars(comment.rating)}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {dayjs(comment.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium w-full break-words">
                      {comment.comment}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="mt-6 flex justify-end gap-2">
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
