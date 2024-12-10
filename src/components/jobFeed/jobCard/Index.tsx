import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { baseUrl } from "@/services/api";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaUser, FaInfoCircle } from "react-icons/fa";

interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  price: number;
  location: {
    cep: string;
    street: string;
    city: string;
    state: string;
  };
  workerId?: string;
  workerName?: string;
  clientId?: {
    _id: string;
    fullName: string;
  };
  imageUrl?: string;
}

interface JobCardProps {
  job: Job;
  onAccept?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
}

export const JobCard = ({ job, onAccept, onCancel }: JobCardProps) => {
  const { token, user } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);
  const [jobWorkerId, setJobWorkerId] = useState(job.workerId);
  const [workerName, setWorkerName] = useState(job.workerName);
  const [cleanedPhotoFile, setCleanedPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    setJobStatus(job.status);
    setJobWorkerId(job.workerId);
    setWorkerName(job.workerName);
  }, [job]);

  const handleAccept = async () => {
    if (jobStatus === "cancelled-by-client") {
      toast.error("Não é possível candidatar-se a um pedido cancelado");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao aceitar trabalho");
      }

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      setJobWorkerId(updatedJob.workerId);
      setWorkerName(updatedJob.workerName);

      toast.success("Trabalho aceito com sucesso!");
      onAccept && onAccept(job._id);
    } catch (error: any) {
      toast.error(error.message || "Erro ao aceitar trabalho");
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao cancelar trabalho");
      }

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      setJobWorkerId(updatedJob.workerId);
      setWorkerName(updatedJob.workerName);

      toast.success("Trabalho cancelado com sucesso!");
      onCancel && onCancel(job._id);
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar trabalho");
    }
  };

  const handleCompleteJob = async () => {
    if (!cleanedPhotoFile) {
      toast.error("Por favor, selecione uma foto da área limpa.");
      return;
    }

    const formData = new FormData();
    formData.append("cleanedPhoto", cleanedPhotoFile);

    try {
      const res = await fetch(`${baseUrl}/jobs/${job._id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao concluir trabalho");
      }

      const updatedJob = await res.json();
      setJobStatus(updatedJob.status);
      toast.success("Trabalho concluído com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao concluir trabalho");
    }
  };

  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg";

  return (
    <li
      className={`bg-white p-4 rounded shadow-md hover:bg-gray-50 transition ${
        jobStatus === "cancelled-by-client" ? "bg-gray-200" : ""
      }`}
    >
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
          {job.clientId && job.clientId.fullName && (
            <p className="text-sm text-gray-800 mb-2 flex items-center gap-1">
              <FaUser className="text-gray-600" />
              <span className="font-bold">Cliente:</span>{" "}
              {job.clientId.fullName}
            </p>
          )}
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
        <p className="text-sm text-gray-800 flex items-center gap-1">
          <MdAttachMoney className="text-gray-600" />
          <span className="font-bold">Preço:</span> R$ {job.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-800 flex items-start gap-1">
          <MdLocationOn className="text-gray-600 mt-0.5" />
          <span className="font-bold">Local:</span>
          <span>
            Rua {job.location.street}, {job.location.city}/{job.location.state}
          </span>
        </p>
      </div>

      {jobStatus === "in-progress" && workerName && (
        <p className="text-sm text-gray-800 mt-2">
          <span className="font-bold">Trabalhador:</span> {workerName}
        </p>
      )}

      {/* Botões de ação */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        {jobWorkerId === user?._id && jobStatus === "in-progress" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCleanedPhotoFile(e.target.files ? e.target.files[0] : null)
              }
              className="text-sm"
            />
            <button
              onClick={handleCompleteJob}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
            >
              Concluir Trabalho
            </button>
          </div>
        )}

        {jobWorkerId === user?._id && jobStatus === "in-progress" && (
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Desistir
          </button>
        )}

        {(!jobWorkerId || jobWorkerId !== user?._id) &&
        jobStatus !== "in-progress" ? (
          <button
            onClick={handleAccept}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark"
            disabled={jobStatus === "cancelled-by-client"}
          >
            Candidatar-se
          </button>
        ) : null}
      </div>
    </li>
  );
};
