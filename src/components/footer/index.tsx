import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>© 2024 Limpfy. Todos os direitos reservados.</p>
        <Link href="/register" className="text-primary hover:underline">
          Trabalhe com a Limpfy
        </Link>
      </div>
    </footer>
  );
};
