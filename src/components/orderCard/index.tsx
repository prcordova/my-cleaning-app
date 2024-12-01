import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

interface Job {
  _id: string;
  title: string;
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

  useEffect(() => {
    setJobStatus(job.status);
    setJobWorkerId(job.workerId);
    setWorkerName(job.workerName);
  }, [job]);

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/jobs/${job._id}/cancel-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-300">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p>{job.description}</p>
      <p>Status: {jobStatus}</p>
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
      <button
        onClick={handleCancelOrder}
        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
      >
        Cancelar Pedido
      </button>
    </li>
  );
};
