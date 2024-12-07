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
  price: number;
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

export const JobFeed = ({ activeTab }: FeedProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sortOption, setSortOption] = useState<string>("createdAtDesc");
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
        setFilteredJobs(data);
      } catch (err: any) {
        console.error(err.message || "Erro ao buscar trabalhos.");
      }
    };

    fetchJobs();
  }, [activeTab, token]);

  useEffect(() => {
    const sortedJobs = [...jobs];
    switch (sortOption) {
      case "nameAsc":
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "nameDesc":
        sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "priceAsc":
        sortedJobs.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedJobs.sort((a, b) => b.price - a.price);
        break;
      case "createdAtAsc":
        sortedJobs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "createdAtDesc":
        sortedJobs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "statusAsc":
        sortedJobs.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "statusDesc":
        sortedJobs.sort((a, b) => b.status.localeCompare(a.status));
        break;
      default:
        break;
    }
    setFilteredJobs(sortedJobs);
  }, [sortOption, jobs]);

  const handleAccept = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  const handleCancel = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold mb-4">
          {activeTab === "my-jobs" ? "Meus Trabalhos" : "Trabalhos Criados"}
        </h2>
        <div className="mb-4">
          <label htmlFor="sort" className="mr-2">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="nameAsc">Nome (A-Z)</option>
            <option value="nameDesc">Nome (Z-A)</option>
            <option value="priceAsc">Preço (Menor para Maior)</option>
            <option value="priceDesc">Preço (Maior para Menor)</option>
            <option value="createdAtAsc">Data de Criação (Ascendente)</option>
            <option value="createdAtDesc">Data de Criação (Descendente)</option>
            <option value="statusAsc">Status (A-Z)</option>
            <option value="statusDesc">Status (Z-A)</option>
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <p>Nenhum trabalho encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
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
