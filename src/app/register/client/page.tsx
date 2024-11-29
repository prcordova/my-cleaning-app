"use client";

import { useState } from "react";

const RegisterClient = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cpf: "",
    address: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/register/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        alert("Erro ao registrar cliente");
        return;
      }

      alert("Registro realizado com sucesso!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Registrar Cliente
        </h1>
        <input
          type="text"
          name="fullName"
          placeholder="Nome Completo"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Endereço"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterClient;
