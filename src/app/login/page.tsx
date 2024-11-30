"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Erro ao realizar login. Verifique suas credenciais.");
      }

      const data = await res.json();
      setAuth(data);
      console.log(data);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Erro ao realizar login.");
    }
  };
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "client" }),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar. Tente novamente.");
      }

      toast.success(
        "Registro realizado com sucesso! Faça login para continuar."
      );
      setIsRegister(false); // Retorna para a tela de login
    } catch (err: any) {
      toast.error(err.message || "Erro ao realizar registro.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          {isRegister ? "Registrar Nova Conta" : "Login"}
        </h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Nome"
            className="w-full p-2 mb-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Confirmar Senha"
            className="w-full p-2 mb-3 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          className="w-full py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          {isRegister ? "Registrar" : "Entrar"}
        </button>

        <div className="mt-4 text-center">
          <p>
            {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:underline"
            >
              {isRegister ? "Entrar" : "Registrar"}
            </button>
          </p>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <p>Deseja trabalhar conosco?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={() => router.push("/register/worker")}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Trabalhe com a Limpfy
            </button>
            <button
              onClick={() => router.push("/register/team")}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Empresas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
