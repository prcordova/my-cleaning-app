import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { baseUrl } from "@/services/api";

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

  return (
    <li
      className={`bg-white p-4 rounded shadow-md hover:bg-gray-300 ${
        jobStatus === "cancelled-by-client" ? "bg-gray-200" : ""
      }`}
    >
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
      {jobWorkerId === user?._id ? (
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
        >
          Desistir
        </button>
      ) : jobStatus !== "in-progress" ? (
        <button
          onClick={handleAccept}
          className="bg-primary text-white px-4 py-2 rounded-lg mt-2"
          disabled={jobStatus === "cancelled-by-client"}
        >
          Candidatar-se
        </button>
      ) : null}
    </li>
  );
};
