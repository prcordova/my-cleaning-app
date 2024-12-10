import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { OrderCard } from "@/components/orderCard/index";
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

  // Aplica filtros de busca e status
  useEffect(() => {
    let currentJobs = [...jobs];

    // Filtro por status (se não for "all")
    if (statusFilter !== "all") {
      currentJobs = currentJobs.filter((job) => job.status === statusFilter);
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
    <div className="mt-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
        <Link href="/new">
          <button className="bg-secondary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary-dark transition">
            Solicitar Limpeza
          </button>
        </Link>
      </div>

      {/* Barra de busca */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="sort" className="mr-2 font-medium">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
          >
            <option value="createdAtDesc">Mais Recentes</option>
            <option value="createdAtAsc">Mais Antigos</option>

            <option value="priceAsc">Preço (Menor para Maior)</option>
            <option value="priceDesc">Preço (Maior para Menor)</option>
          </select>
        </div>
      </div>

      {/* Tabs de status */}
      <div className="mb-4 flex gap-4 border-b border-gray-300 pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1 rounded transition ${
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
        <p className="text-gray-600">Nenhum trabalho encontrado.</p>
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
