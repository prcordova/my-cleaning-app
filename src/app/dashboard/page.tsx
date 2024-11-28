"use client";

import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white p-4">
        <h1 className="text-xl">Dashboard</h1>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/dashboard/solicitar")}
            className="bg-white p-4 shadow rounded cursor-pointer border-l-4 border-primary hover:shadow-lg"
          >
            <h2 className="text-lg font-bold">Solicitar Limpeza</h2>
            <p>Selecione o tipo e o tamanho de sua limpeza.</p>
          </div>
          <div
            onClick={() => router.push("/ratings")}
            className="bg-white p-4 shadow rounded cursor-pointer border-l-4 border-secondary hover:shadow-lg"
          >
            <h2 className="text-lg font-bold">Avaliações</h2>
            <p>Veja feedbacks de outros clientes.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
