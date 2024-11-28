import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Bem-vindo ao Limpfy</h1>
      <p className="mt-4 text-lg">
        Serviços de limpeza rápidos e confiáveis a apenas alguns cliques de
        você.
      </p>
      <div className="mt-6 flex gap-4">
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
    </div>
  );
}
