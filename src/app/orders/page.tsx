"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { JobCard } from "@/components/jobCard/Index";
import Link from "next/link";

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

export default function Orders() {
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto mt-2">
        <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
        {jobs.length === 0 ? (
          <>
            <p>Nenhum trabalho encontrado.</p>
            <p>
              <Link href="/new" className="text-blue-500">
                Clique aqui para criar um novo trabalho.
              </Link>
            </p>
          </>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
