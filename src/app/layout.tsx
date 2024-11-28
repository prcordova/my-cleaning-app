import { ReactNode } from "react";
import "../styles/globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Cleanup Service",
  description: "Serviço rápido e moderno para limpezas personalizadas",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Header />
        <main className="container mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="p-4 bg-secondary text-white text-center">
          © {new Date().getFullYear()} Limpfy - Todos os direitos reservados
        </footer>
      </body>
    </html>
  );
};

export default Layout;
