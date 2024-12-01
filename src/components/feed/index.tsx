// components/Feed.tsx
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { JobCard } from "@/components/jobCard/Index";
import toast from "react-hot-toast";

export const Feed = () => {
  const [jobs, setJobs] = useState([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/jobs", {
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

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Trabalhos Criados</h2>
      {jobs.length === 0 ? (
        <p>Nenhum trabalho encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </ul>
      )}
    </div>
  );
};
