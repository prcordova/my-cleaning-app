import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { baseUrl } from "@/services/api";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import {
  FaInfoCircle,
  FaImage,
  FaBalanceScale,
  FaLifeRing,
  FaStar,
} from "react-icons/fa";

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

interface OrderCardProps {
  job: Job;
  onCancel?: (jobId: string) => void;
}

export const OrderCard = ({ job, onCancel }: OrderCardProps) => {
  const { token } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);
  const [showImages, setShowImages] = useState(false);

  // Estado para avaliação
  const [rating, setRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState("");

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

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      toast.success(
        "Disputa aberta com sucesso! O suporte foi notificado e irá analisar."
      );
    } catch (error: any) {
      toast.error(error.message || "Erro ao abrir disputa");
    }
  };

  const handleRequestHelp = () => {
    // Lógica para pedir ajuda ao suporte após expirar o prazo de disputa
    // Pode abrir um modal ou redirecionar para um chat com suporte
    toast("Solicitação de ajuda enviada ao suporte.", { icon: "ℹ️" });
  };

  const handleSendRating = async () => {
    if (rating == null) {
      toast.error("Por favor, selecione uma nota antes de enviar.");
      return;
    }
    // Endpoint para enviar avaliação ao backend
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

      toast.success("Avaliação enviada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar avaliação");
    }
  };

  // Mensagem de tempo restante para liberar pagamento
  let timeMessage = "";
  let diffMinutes = 0;
  if (jobStatus === "waiting-for-rating" && job.disputeUntil) {
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

          {jobStatus === "waiting-for-rating" && (
            <div className="mt-3 text-sm text-gray-800">
              <p className="font-bold mb-1">Trabalho concluído!</p>
              <p className="mb-2">{timeMessage}</p>
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
                  {/* Avaliação do trabalho */}
                </div>
              )}

              {!job.isRated ? (
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
                <p className="text-sm text-gray-600">
                  Você já avaliou esse serviço.
                </p>
              )}
            </div>
          )}
          {jobStatus === "dispute" && (
            <div className="mt-3 text-sm text-gray-800">
              <p className="font-bold mb-1">Disputa em andamento!</p>
              <p>
                O suporte foi notificado e está analisando o caso. Por favor,
                aguarde enquanto um administrador entra em contato ou toma uma
                decisão.
              </p>
            </div>
          )}

          {jobStatus === "in-progress" && job.workerId && (
            <p className="text-sm text-gray-800 mt-2">
              <span className="font-bold">Trabalhador:</span>{" "}
              {job.workerId.fullName}
            </p>
          )}

          {jobStatus !== "waiting-for-rating" &&
            jobStatus !== "completed" &&
            jobStatus !== "dispute" && (
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
            )}
        </div>
      )}
    </li>
  );
};
