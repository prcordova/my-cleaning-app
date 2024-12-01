"use client";

import { OrderFeed } from "@/components/orderFeed/index";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Orders() {
  const { isLoggedIn, role } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto mt-2">
        {isLoggedIn ? (
          <OrderFeed />
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
