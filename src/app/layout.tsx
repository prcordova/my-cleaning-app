import { ReactNode } from "react";
import "../styles/globals.css";
import { Header } from "@/components/header/index";
import { Footer } from "@/components/footer/index";
import "../utils/chart";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Cleanup Service",
  description: "Serviço rápido e moderno para limpezas personalizadas",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <ThemeProvider>
          <Toaster position="top-center" />
          <Header />
          <main className="container mx-auto p-6">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
