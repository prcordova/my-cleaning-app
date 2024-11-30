"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto mt-8">
        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold">Bem-vindo ao Limpfy</h2>
          <p className="mt-4 text-lg">
            Serviços de limpeza rápidos e confiáveis a apenas alguns cliques de
            você.
          </p>
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
        </div>
        <section className="mt-20 flex flex-wrap items-center shadow-lg p-4 rounded-lg bg-white">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold text-center md:text-left">
              Nossa Missão
            </h2>
            <p className="mt-4 text-lg text-center md:text-left">
              Proporcionar serviços de limpeza de alta qualidade, garantindo a
              satisfação e bem-estar de nossos clientes.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-4 flex justify-center">
            <Image
              src="/assets/imgs/crianças.jpg"
              width={400}
              height={400}
              alt="Nossa Missão"
              className="rounded-lg shadow-md"
            />
          </div>
        </section>
        <section className="mt-20 flex flex-wrap items-center shadow-lg p-4 rounded-lg bg-white">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold text-center md:text-left">
              Nossos Valores
            </h2>
            <p className="mt-4 text-lg text-center md:text-left">
              Compromisso, qualidade, confiança e respeito ao meio ambiente.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-4 flex justify-center">
            <Image
              src="/assets/imgs/sorridente.jpg"
              width={400}
              height={400}
              alt="Nossos Valores"
              className="rounded-lg shadow-md"
            />
          </div>
        </section>
        <section className="mt-20 flex flex-wrap items-center shadow-lg p-4 rounded-lg bg-white">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold text-center md:text-left">
              Sobre Nós
            </h2>
            <p className="mt-4 text-lg text-center md:text-left">
              Somos uma empresa dedicada a oferecer serviços de limpeza
              personalizados para atender às necessidades de nossos clientes.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-4 flex justify-center">
            <Image
              src="/assets/imgs/homemLimpando.jpg"
              width={400}
              height={400}
              alt="Sobre Nós"
              // className="rounded-lg shadow-md"
            />
          </div>
        </section>
        <section className="mt-20 flex flex-wrap items-center shadow-lg p-4 rounded-lg bg-white">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold text-center md:text-left">
              Contato
            </h2>
            <p className="mt-4 text-lg text-center md:text-left">
              Entre em contato conosco para mais informações sobre nossos
              serviços.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-4 flex justify-center">
            <Image
              src="/assets/imgs/contact.png"
              width={400}
              height={400}
              alt="Contato"
              className="rounded-lg shadow-md"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
