// app/layout.tsx (continua sem "use client")
import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import "../styles/globals.css";
import "../utils/chart";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Cleanup Service",
  description: "Serviço rápido e moderno para limpezas personalizadas",
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
}
