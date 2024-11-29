import { useEffect, useState } from "react";

const RegistrationStatus = () => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("http://localhost:5000/auth/status", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setStatus(data.status);
    };

    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Status do Cadastro
        </h1>
        <p className="text-lg">
          {status === "approved"
            ? "Cadastro aprovado! Você já pode usar a plataforma."
            : status === "pending"
            ? "Seu cadastro está em análise. Por favor, aguarde."
            : "Cadastro rejeitado. Entre em contato para mais detalhes."}
        </p>
      </div>
    </div>
  );
};

export default RegistrationStatus;
