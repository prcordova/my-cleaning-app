"use client";
import Link from "next/link";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { isLoggedIn, clearAuth } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          Cleanup Service
        </Link>
        <nav className="flex gap-4 items-center">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>

          <h1> {user?.fullName}</h1>
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
