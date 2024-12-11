// components/orderFeed/orderCard/OrderCardCompleted.tsx

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { baseUrl } from "@/services/api";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import {
  FaInfoCircle,
  FaImage,
  FaBalanceScale,
  FaLifeRing,
  FaStar,
  FaCheck,
} from "react-icons/fa";

dayjs.extend(relativeTime);

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

interface OrderCardCompletedProps {
  job: Job;
  onJobUpdate?: (updatedJob: Job) => void;
}

export const OrderCardCompleted = ({
  job,
  onJobUpdate,
}: OrderCardCompletedProps) => {
  const { token } = useAuthStore();
  const [showImages, setShowImages] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState("");
  const [isRated, setIsRated] = useState<boolean>(job.isRated || false);

  useEffect(() => {
    setIsRated(job.isRated || false);
  }, [job.isRated]);

  // Mensagem de tempo restante para liberar pagamento
  let timeMessage = "";
  let diffMinutes = 0;
  if (job.status === "waiting-for-rating" && job.disputeUntil) {
    const disputeTime = dayjs(job.disputeUntil);
    const now = dayjs();
    diffMinutes = disputeTime.diff(now, "minute");
    if (diffMinutes > 0) {
      timeMessage = `Você tem ${diffMinutes} minutos para contestar o trabalho antes da liberação do pagamento.`;
    } else {
      timeMessage =
        "O período de contestação expirou. O pagamento será liberado em breve.";
    }
  }

  // Função para aceitar a conclusão do trabalho
  const handleAcceptCompletion = async () => {
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/accept-completion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.message || "Erro ao aceitar conclusão do trabalho"
        );
      }

      const updatedJob: Job = await res.json();
      toast.success("Conclusão do trabalho aceita com sucesso!");
      onJobUpdate && onJobUpdate(updatedJob);
    } catch (error: any) {
      toast.error(error.message || "Erro ao aceitar conclusão do trabalho");
    }
  };

  const handleOpenDispute = async () => {
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/open-dispute`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Qualidade do serviço insatisfatória" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao abrir disputa");
      }

      const updatedJob: Job = await res.json();
      toast.success(
        "Disputa aberta com sucesso! O suporte foi notificado e irá analisar."
      );
      onJobUpdate && onJobUpdate(updatedJob);
    } catch (error: any) {
      toast.error(error.message || "Erro ao abrir disputa");
    }
  };

  const handleRequestHelp = () => {
    // Implementar a lógica para pedir ajuda ao suporte, como abrir um modal
    toast("Solicitação de ajuda enviada ao suporte.", { icon: "ℹ️" });
  };

  const handleSendRating = async () => {
    if (rating == null) {
      toast.error("Por favor, selecione uma nota antes de enviar.");
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/rate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment: ratingComment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao enviar avaliação");
      }

      // Após sucesso, atualize isRated e informe o OrderFeed
      const responseData = await res.json();
      setIsRated(true);
      toast.success("Avaliação enviada com sucesso!");
      if (onJobUpdate) {
        onJobUpdate(responseData.job); // Atualiza o job na lista do OrderFeed
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar avaliação");
    }
  };

  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-50 transition">
      {/* Topo: Imagem e Título */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-shrink-0">
          <img
            src={job.imageUrl || "/assets/imgs/homemLimpando.jpg"}
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

      {/* Conteúdo Específico do Status */}
      <div className="mt-3 text-sm text-gray-800">
        <p className="font-bold mb-1">Trabalho concluído!</p>
        {job.status === "waiting-for-rating" && (
          <p className="mb-2">{timeMessage}</p>
        )}

        {job.cleanedPhoto && (
          <button
            onClick={() => setShowImages((prev) => !prev)}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
          >
            <FaImage />
            {showImages ? "Ocultar Imagens" : "Ver Imagens"}
          </button>
        )}
        {showImages && job.cleanedPhoto && (
          <div className="mt-2">
            <img
              src={`/${job.cleanedPhoto}`}
              alt="Área limpa"
              className="rounded w-full max-w-[200px] h-auto"
            />
          </div>
        )}

        {job.status === "waiting-for-rating" && (
          <>
            {diffMinutes > 0 ? (
              <button
                onClick={handleOpenDispute}
                className="flex items-center gap-1 text-red-600 hover:underline text-sm mt-2"
              >
                <FaBalanceScale />
                Abrir Disputa
              </button>
            ) : (
              <div className="mt-2 flex flex-col sm:flex-row items-start gap-2">
                {/* Após expirar prazo, pode pedir ajuda ao suporte */}
                <button
                  onClick={handleRequestHelp}
                  className="flex items-center gap-1 text-purple-600 hover:underline text-sm"
                >
                  <FaLifeRing />
                  Pedir Ajuda
                </button>
                {/* Avaliação do trabalho, apenas se ainda não foi avaliado */}
                {!isRated ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer ${
                            rating && rating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Deixe um comentário (opcional)"
                      className="w-full p-1 border rounded text-sm"
                    />
                    <button
                      onClick={handleSendRating}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Enviar Avaliação
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <FaStar />
                    <span>Avaliação enviada.</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Botões de ação */}
      {/* <div className="mt-4 flex justify-end gap-2">
        {job.status === "waiting-for-rating" && (
          <button
            onClick={handleAcceptCompletion}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            <FaCheck /> Aceitar Conclusão
          </button>
        )}
      </div> */}
    </li>
  );
};
