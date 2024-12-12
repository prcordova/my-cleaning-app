"use client";
import { useState } from "react";

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState([
    { id: 1, description: "Limpeza de quintal", status: "available" },
    { id: 2, description: "Retirada de entulho", status: "available" },
  ]);

  const aceitarTrabalho = (id: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, status: "accepted" } : job
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-secondary text-white p-4">
        <h1 className="text-xl">Trabalhos Disponíveis</h1>
      </header>
      <main className="p-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-4 shadow rounded border-l-4 mb-4"
          >
            <h2 className="font-bold">{job.description}</h2>
            <button
              onClick={() => aceitarTrabalho(job.id)}
              disabled={job.status === "accepted"}
              className={`mt-2 py-2 px-4 ${
                job.status === "accepted"
                  ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                  : "bg-secondary text-white hover:bg-primary"
              } rounded`}
            >
              {job.status === "accepted" ? "Aceito" : "Aceitar Trabalho"}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default WorkerDashboard;
