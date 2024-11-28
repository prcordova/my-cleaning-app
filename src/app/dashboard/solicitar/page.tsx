"use client";

import { useState } from "react";

const SolicitarLimpeza = () => {
  const [type, setType] = useState("");
  const [workers, setWorkers] = useState(1);

  const handleSubmit = () => {
    const requestData = { type, workers };

    // Aqui você faz a chamada para a API do backend (em Node.js)
    fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Token do cliente
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then((data) => console.log("Pedido criado:", data))
      .catch((err) => console.error("Erro ao criar pedido:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitar Limpeza</h1>
      <div className="mb-4">
        <label className="block font-bold mb-2">Tipo de Limpeza</label>
        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="pequeno">Pequeno</option>
          <option value="medio">Médio</option>
          <option value="grande">Grande</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Quantos Trabalhadores?</label>
        <input
          type="number"
          min="1"
          max="5"
          className="w-full p-2 border rounded"
          value={workers}
          onChange={(e) => setWorkers(Number(e.target.value))}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
      >
        Solicitar
      </button>
    </div>
  );
};

export default SolicitarLimpeza;
