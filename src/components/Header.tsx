import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
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
  );
};
