import { ReactNode } from "react";
import Link from "next/link";
import "../styles/globals.css";

export const metadata = {
  title: "Cleanup Service",
  description: "Serviço rápido e moderno para limpezas personalizadas",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {/* Header */}
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-lg font-bold">
              Cleanup Service
            </Link>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="hover:underline">
                Histórico
              </Link>

              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <p>
              © {new Date().getFullYear()} Cleanup Service - Todos os direitos
              reservados
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
