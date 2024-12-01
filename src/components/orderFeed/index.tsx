import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { OrderCard } from "@/components/orderCard/Index";

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

export const OrderFeed = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/jobs/client-jobs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar trabalhos.");
        }

        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        console.error(err.message || "Erro ao buscar trabalhos.");
      }
    };

    fetchJobs();
  }, [token]);

  const handleCancelOrder = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
      {jobs.length === 0 ? (
        <p>Nenhum trabalho encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <OrderCard key={job._id} job={job} onCancel={handleCancelOrder} />
          ))}
        </ul>
      )}
    </div>
  );
};
