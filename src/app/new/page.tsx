"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [workers, setWorkers] = useState(1);
  const { token } = useAuthStore();

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          type,
          workers,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar trabalho.");
      }

      const data = await res.json();
      console.log("data", data);
      toast.success("Trabalho criado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar trabalho.");
    }
  };

  return (
    <div>
      <h1>Criar Trabalho</h1>
      <div className="mb-4">
        <label className="block font-bold mb-2">Título</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Descrição</label>
        <textarea
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Tipo</label>
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
        Criar Trabalho
      </button>
    </div>
  );
};

export default CreateJob;
