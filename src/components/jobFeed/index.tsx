// components/jobFeed/index.tsx

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/services/api";
import { JobCardPending } from "./jobCardPending";
import { JobCardInProgress } from "./jobCardInProgress";
import { JobCardCompleted } from "./jobCardCompleted";
import { JobCardCancelled } from "./jobCardCancelled";
import { JobCardDispute } from "./jobCardDispute";

interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  price?: number;
  isRated?: boolean;
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

interface FeedProps {
  activeTab: string;
}

const statusTabs = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Em Progresso", value: "in-progress" },
  { label: "Concluídos", value: "completed" },
  { label: "Aguardando Avaliação", value: "waiting-for-rating" },
  { label: "Cancelados", value: "cancelled-by-client" },
  { label: "Em Disputa", value: "dispute" },
];

export const JobFeed = ({ activeTab }: FeedProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sortOption, setSortOption] = useState<string>("createdAtDesc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

        let data = await res.json();

        // Se não estiver em "my-jobs", filtrar para mostrar apenas pendentes
        if (activeTab !== "my-jobs") {
          data = data.filter((job: Job) => job.status === "pending");
        }

        setJobs(data);
      } catch (err: any) {
        console.error(err.message || "Erro ao buscar trabalhos.");
      }
    };

    fetchJobs();
  }, [activeTab, token]);

  useEffect(() => {
    let currentJobs = [...jobs];

    // Só aplicar filtros de status se estiver em "my-jobs"
    if (activeTab === "my-jobs") {
      if (statusFilter !== "all") {
        currentJobs = currentJobs.filter((job) => job.status === statusFilter);
      }
    }

    // Filtro por busca no título
    if (searchQuery.trim() !== "") {
      currentJobs = currentJobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenação
    switch (sortOption) {
      case "priceAsc":
        currentJobs.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceDesc":
        currentJobs.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "createdAtAsc":
        currentJobs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "createdAtDesc":
        currentJobs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredJobs(currentJobs);
  }, [sortOption, jobs, searchQuery, statusFilter, activeTab]);

  // Função para atualizar o trabalho na lista
  const handleJobUpdate = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
    );
  };

  // Função para renderizar o componente de JobCard adequado
  const renderJobCard = (job: Job) => {
    switch (job.status) {
      case "pending":
        return (
          <JobCardPending
            key={job._id}
            job={job}
            onJobUpdate={handleJobUpdate}
          />
        );
      case "in-progress":
        return (
          <JobCardInProgress
            key={job._id}
            job={job}
            onJobUpdate={handleJobUpdate}
          />
        );
      case "completed":
      case "waiting-for-rating":
        return (
          <JobCardCompleted
            key={job._id}
            job={job}
            onJobUpdate={handleJobUpdate}
          />
        );
      case "cancelled":
      case "cancelled-by-client":
        return <JobCardCancelled key={job._id} job={job} />;
      case "dispute":
        return <JobCardDispute key={job._id} job={job} />;
      default:
        return null;
    }
  };

  // Contagem de cada status para decidir quais abas mostrar
  const statusCounts = jobs.reduce((acc: Record<string, number>, job: Job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Contagem total
  const totalCount = jobs.length;

  return (
    <div className="mt-4 px-2 sm:px-0">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">
          {activeTab === "my-jobs" ? "Meus Trabalhos" : "Trabalhos Criados"}
        </h2>
      </div>

      {/* Barra de busca e ordenação */}
      <div className="mb-4 flex flex-wrap gap-2 items-center sm:gap-4">
        <div className="flex-1 min-w-[150px]">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="font-medium text-sm sm:text-base">
            Ordenar:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-primary text-sm sm:text-base"
          >
            <option value="createdAtDesc">Mais Recentes</option>
            <option value="createdAtAsc">Mais Antigos</option>
            <option value="priceAsc">Preço (Menor para Maior)</option>
            <option value="priceDesc">Preço (Maior para Menor)</option>
          </select>
        </div>
      </div>

      {/* Tabs de status - somente se for "my-jobs" */}
      {activeTab === "my-jobs" && (
        <div className="mb-4 flex flex-wrap gap-2 sm:gap-4 border-b border-gray-300 pb-2">
          {statusTabs.map((tab) => {
            let shouldShowTab = false;

            if (tab.value === "all") {
              // Mostrar "Todos" se houver qualquer job
              shouldShowTab = totalCount > 0;
            } else {
              // Mostrar somente se houver ao menos um job desse status
              shouldShowTab = (statusCounts[tab.value] || 0) > 0;
            }

            if (!shouldShowTab) return null;

            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-2 py-1 rounded transition text-sm ${
                  statusFilter === tab.value
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <p className="text-gray-600 text-sm sm:text-base">
          Nenhum trabalho encontrado.
        </p>
      ) : (
        <>
          <div className="space-y-4 flex text-center justify-center">
            <div>{`${filteredJobs.length} trabalho${
              filteredJobs.length > 1 ? "s" : ""
            } encontrado${filteredJobs.length > 1 ? "s" : ""}`}</div>
          </div>
          <ul className="space-y-4">
            {filteredJobs.map((job) => renderJobCard(job))}
          </ul>
        </>
      )}
    </div>
  );
};
