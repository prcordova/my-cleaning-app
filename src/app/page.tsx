import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Bem-vindo ao Cleanup Service
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Serviço rápido e prático para suas limpezas personalizadas. Escolha a
        simplicidade ou crie uma solicitação avançada em poucos cliques.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/dashboard/solicitar">
          <div className="p-6 bg-primary text-white rounded shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-2">Solicitar Limpeza</h2>
            <p className="text-sm">
              Escolha entre limpezas simples ou avançadas.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <Image
          src=""
          alt="Ilustração de limpeza"
          width={400}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
