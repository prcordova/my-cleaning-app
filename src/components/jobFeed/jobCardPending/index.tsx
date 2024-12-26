// components/jobFeed/jobCard/JobCardPending.tsx

import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { baseUrl } from "@/services/api";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaUser, FaInfoCircle, FaCheck } from "react-icons/fa";

interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  price?: number;
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
  cleanedPhoto?: string;
  completedAt?: string;
  disputeUntil?: string;
}

interface JobCardPendingProps {
  job: Job;
  onJobUpdate?: (updatedJob: Job) => void;
}

export const JobCardPending = ({ job, onJobUpdate }: JobCardPendingProps) => {
  const { token } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);

  useEffect(() => {
    setJobStatus(job.status);
  }, [job]);

  const handleAccept = async () => {
    if (jobStatus === "cancelled-by-client") {
      toast.error("Não é possível aceitar um pedido cancelado");
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

      const updatedJob: Job = await res.json();
      setJobStatus(updatedJob.status);

      toast.success("Trabalho aceito com sucesso!");
      if (onJobUpdate) {
        onJobUpdate(updatedJob);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao aceitar trabalho");
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

      {/* Botão de Aceitar */}
      <div className="mt-4 flex justify-end gap-2">
        {jobStatus === "pending" && (
          <button
            onClick={handleAccept}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark flex items-center gap-1"
          >
            <FaCheck /> Aceitar Trabalho
          </button>
        )}
      </div>
    </li>
  );
};
