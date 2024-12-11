"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
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

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Logar{" "}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          autoComplete="password"
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Entrar
        </button>

        <div className="mt-4 text-center">
          <p>
            Não tem uma conta?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-primary hover:underline"
            >
              Registrar
            </button>
          </p>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <p>Deseja trabalhar conosco?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={() => router.push("/register")}
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
