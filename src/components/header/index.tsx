"use client";
import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BuildIcon from "@mui/icons-material/Build"; // Ícone para "Trabalhar"
import ListAltIcon from "@mui/icons-material/ListAlt"; // Ícone para "Meus Pedidos"
import { NotificationMenu } from "./notificationsMenu";
import { Avatar } from "@mui/material";
import { baseUrl } from "@/services/api";

// Classe utilitária para ícones: largura e altura ~20px
const iconClass = "w-5 h-5";

export const Header = () => {
  const { isLoggedIn, clearAuth, token, role, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  // Extrai apenas o primeiro nome do usuário, caso exista
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "";
  const avatarImage = user?.avatar ? `${baseUrl}${user.avatar}` : "";

  return (
    <header className="bg-primary text-white p-3 sm:p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-2">
        <Link href="/" className="text-lg font-bold whitespace-nowrap">
          Limp<span className="text-black">Fy</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 flex-wrap text-sm sm:text-base">
          {isLoggedIn && role === "worker" && (
            <Link
              href="/jobs"
              className="hover:underline whitespace-nowrap flex items-center gap-1"
            >
              <BuildIcon fontSize="inherit" className={iconClass} />
              <span>Trabalhar</span>
            </Link>
          )}
          {isLoggedIn && firstName && (
            <span className="whitespace-nowrap font-medium">{firstName} |</span>
          )}

          {isLoggedIn && role !== "worker" && (
            <Link
              href="/orders"
              className="hover:underline whitespace-nowrap flex items-center gap-1"
            >
              <span className="hidden md:inline">Pedidos</span>
              <ListAltIcon
                fontSize="inherit"
                className={iconClass}
                titleAccess="Orders"
              />
            </Link>
          )}

          {isLoggedIn && user && token && (
            <NotificationMenu userId={user._id} token={token} />
          )}

          {isLoggedIn && (
            <Link
              href="/profile"
              className="flex items-center hover:underline gap-1"
            >
              <Avatar
                alt={user?.fullName || "Usuário"}
                src={avatarImage}
                sx={{ width: 25, height: 25 }}
              />
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-secondary text-white px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100 text-xs sm:text-sm"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
