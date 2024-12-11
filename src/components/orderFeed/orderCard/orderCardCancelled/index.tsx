// components/orderFeed/orderCard/OrderCardCancelled.tsx

import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/services/api";
import { MdLocationOn, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { FaInfoCircle, FaRedo } from "react-icons/fa";
import { useState } from "react";

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

interface OrderCardCancelledProps {
  job: Job;
  onJobUpdate?: (updatedJob: Job) => void;
}

export const OrderCardCancelled = ({
  job,
  onJobUpdate,
}: OrderCardCancelledProps) => {
  const { token } = useAuthStore();
  const [jobStatus, setJobStatus] = useState(job.status);

  const displayImage = job.imageUrl || "/assets/imgs/homemLimpando.jpg";

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

      const updatedJob: Job = await res.json();
      setJobStatus(updatedJob.status);
      toast.success("Pedido reativado com sucesso!");
      onJobUpdate && onJobUpdate(updatedJob);
    } catch (error: any) {
      toast.error(error.message || "Erro ao reativar pedido");
    }
  };

  return (
    <li className="bg-gray-200 p-4 rounded shadow-md">
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

      {/* Mensagem de Cancelamento */}
      <div className="mt-3 text-sm text-gray-800">
        <p className="font-bold mb-1 text-red-600">
          Este pedido foi cancelado.
        </p>
        {job.status === "cancelled-by-client" && (
          <button
            onClick={handleReactivateOrder}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            <FaRedo /> Reativar Pedido
          </button>
        )}
      </div>
    </li>
  );
};
