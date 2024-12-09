"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { io } from "socket.io-client";
import { baseUrl } from "@/services/api";

const socket = io(baseUrl);

export const Header = () => {
  const { isLoggedIn, clearAuth } = useAuthStore();
  const role = useAuthStore((state) => state.role);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      socket.emit("join", user._id); // Use `user._id`

      socket.on("jobAccepted", (data) => {
        alert(data.message);
      });
    }

    return () => {
      socket.off("jobAccepted");
    };
  }, [user]);

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
          {isLoggedIn && role === "worker" && (
            <Link href="/jobs">Trabalhar</Link>
          )}

          {isLoggedIn && role !== "worker" && (
            <Link href="/orders">Meus Pedidos</Link>
          )}

          <h1> {user?.fullName}</h1>

          <Link href="/profile">
            <AccountCircleIcon />
          </Link>

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
