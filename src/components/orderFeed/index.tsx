import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { OrderCard } from "@/components/orderFeed/orderCard/index";
import Link from "next/link";
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

const statusTabs = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Em Progresso", value: "in-progress" },
  { label: "Concluídos", value: "completed" },
  { label: "Cancelados", value: "cancelled-by-client" },
];

export const OrderFeed = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sortOption, setSortOption] = useState<string>("createdAtDesc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${baseUrl}/jobs/client-jobs`, {
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

    if (token) {
      fetchJobs();
    }
  }, [token]);

  useEffect(() => {
    let currentJobs = [...jobs];

    // Filtro por status
    if (statusFilter !== "all") {
      currentJobs = currentJobs.filter((job) => job.status === statusFilter);
    }

    // Filtro por busca
    if (searchQuery.trim() !== "") {
      currentJobs = currentJobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenação
    switch (sortOption) {
      case "priceAsc":
        currentJobs.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        currentJobs.sort((a, b) => b.price - a.price);
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
  }, [sortOption, jobs, searchQuery, statusFilter]);

  return (
    <div className="mt-4 px-2 sm:px-0">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Meus Pedidos</h2>
        <Link href="/new">
          <button className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark transition text-sm sm:text-base">
            Solicitar Limpeza
          </button>
        </Link>
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

      {/* Tabs de status */}
      <div className="mb-4 flex flex-wrap gap-2 sm:gap-4 border-b border-gray-300 pb-2">
        {statusTabs.map((tab) => (
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
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-600 text-sm sm:text-base">
          Nenhum trabalho encontrado.
        </p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <OrderCard key={job._id} job={job} />
          ))}
        </ul>
      )}
    </div>
  );
};
