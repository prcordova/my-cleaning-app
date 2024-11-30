"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Feed } from "@/components/feed/index";
import { useRouter } from "next/navigation";

export default function Jobs() {
  const { isLoggedIn, role } = useAuthStore();
  const router = useRouter();

  if (role !== "worker") {
    return router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto mt-8">
        {isLoggedIn ? (
          <>
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/login">
                <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-md">
                  Entrar
                </button>
              </Link>
              <Link href="/new">
                <button className="bg-secondary text-white px-6 py-3 rounded-lg shadow-md">
                  Solicitar Limpeza
                </button>
              </Link>
            </div>
            <Feed />
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
