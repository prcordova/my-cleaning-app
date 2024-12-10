"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "@/services/api";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const socket = io(baseUrl);

export const Header = () => {
  const { isLoggedIn, clearAuth } = useAuthStore();
  const role = useAuthStore((state) => state.role);
  const { user } = useAuthStore();
  const router = useRouter();
  const { token } = useAuthStore();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      fetch(`${baseUrl}/notifications/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications); // Agora você tem as notificações persistidas
        });
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", user._id);

      // Recebemos várias notificações de diferentes tipos
      const handleNotification = (data) => {
        const newNotif = {
          ...data,
          read: false,
          id: Date.now(), // ID único
        };
        setNotifications((prev) => [...prev, newNotif]);
      };

      // Eventos variados de notificação
      socket.on("jobAccepted", handleNotification);
      socket.on("profileUpdate", handleNotification);
      socket.on("newPost", handleNotification);

      // ... Se houver mais tipos de eventos, todos chamam handleNotification

      return () => {
        socket.off("jobAccepted", handleNotification);
        socket.off("profileUpdate", handleNotification);
        socket.off("newPost", handleNotification);
      };
    }
  }, [user]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    // Redirecionar com base no type da notificação
    switch (notif.type) {
      case "job":
        // Vamos supor que iremos para detalhes do job
        router.push(`/job-details/${notif.jobId}`);
        break;
      case "profile":
        // Redireciona para o perfil do usuário (ou do trabalhador)
        // Ajuste conforme sua rota real
        // Se tiver workerId, por exemplo: `/worker-profile/${notif.workerId}`
        if (notif.workerId) {
          router.push(`/worker-profile/${notif.workerId}`);
        } else {
          router.push("/profile");
        }
        break;
      case "news":
        router.push("/news");
        break;
      default:
        break;
    }

    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);

    if (!user) return;

    fetch(`${baseUrl}/notifications/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setShowNotifications(false);
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md relative">
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

          <h1>{user?.fullName}</h1>

          {/* Ícone de Notificações */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative focus:outline-none"
              >
                <NotificationsIcon />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-8 right-0 bg-white text-black p-2 rounded shadow-lg w-72 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Notificações</span>
                    <div className="flex gap-2">
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-gray-600 hover:text-gray-800 underline"
                      >
                        Marcar todas como lidas
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 text-sm">
                    {notifications.length === 0 ? (
                      <div className="text-gray-500">Sem notificações</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                            !notif.read ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {notif.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
