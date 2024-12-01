import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

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
}

interface JobCardProps {
  job: Job;
  onAccept: (jobId: string) => void;
}

export const JobCard = ({ job, onAccept }: JobCardProps) => {
  const { token } = useAuthStore();

  const handleAccept = async () => {
    try {
      const res = await fetch(`http://localhost:3000/jobs/${job._id}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao aceitar trabalho");
      }

      toast.success("Trabalho aceito com sucesso!");
      onAccept(job._id);
    } catch (error: any) {
      toast.error(error.message || "Erro ao aceitar trabalho");
    }
  };

  return (
    <li className="bg-white p-4 rounded shadow-md hover:bg-gray-300">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p>{job.description}</p>
      <p>Status: {job.status}</p>
      <p>Criado em: {dayjs(job.createdAt).format("DD/MM/YYYY")}</p>
      <p>
        Endereço:
        <span className="font-semibold">
          {" "}
          Rua: {job.location.street}, Cidade: {job.location.city}, Estado:{" "}
          {job.location.state}
        </span>
      </p>
      <button
        onClick={handleAccept}
        className="bg-primary text-white px-4 py-2 rounded-lg mt-2"
      >
        Candidatar-se
      </button>
    </li>
  );
};
