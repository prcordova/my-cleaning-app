"use client";

import { useAuthStore } from "@/store/authStore";
import { JobFeed } from "@/components/jobFeed/index";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Jobs() {
  const { isLoggedIn, role } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  if (role !== "worker") {
    return router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto mt-2">
        {isLoggedIn ? (
          <>
            <div className="mt-6 flex gap-4 justify-center">
              <button
                className={`px-4 py-2 ${
                  activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("all")}
              >
                Buscar Trabalho{" "}
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "my-jobs"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("my-jobs")}
              >
                Meus Trabalhos
              </button>
            </div>
            <JobFeed activeTab={activeTab} />
          </>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold">Bem-vindo ao Limpfy</h2>
            <p className="mt-4 text-lg">
              Serviços de limpeza rápidos e confiáveis a apenas alguns cliques
              de você.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
