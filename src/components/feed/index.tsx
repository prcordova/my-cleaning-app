import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { JobCard } from "@/components/jobCard/Index";
import { baseUrl } from "@/services/api";

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
}

interface FeedProps {
  activeTab: string;
}

export const Feed = ({ activeTab }: FeedProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const endpoint =
          activeTab === "my-jobs"
            ? `${baseUrl}/jobs/my-jobs`
            : `${baseUrl}/jobs`;
        const res = await fetch(endpoint, {
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
  }, [activeTab, token]);

  const handleAccept = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  const handleCancel = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">
        {activeTab === "my-jobs" ? "Meus Trabalhos" : "Trabalhos Criados"}
      </h2>
      {jobs.length === 0 ? (
        <p>Nenhum trabalho encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onAccept={handleAccept}
              onCancel={handleCancel}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
