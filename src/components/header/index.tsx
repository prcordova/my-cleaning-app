"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "@/services/api";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build"; // Ícone para "Trabalhar"
import ListAltIcon from "@mui/icons-material/ListAlt"; // Ícone para "Meus Pedidos"

const socket = io(baseUrl);

export const Header = () => {
  const { isLoggedIn, clearAuth, token, role, user } = useAuthStore();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Extrai apenas o primeiro nome do usuário, caso exista
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "";

  useEffect(() => {
    if (user && user._id && token) {
      fetch(`${baseUrl}/notifications/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
        });
    }
  }, [user, token]);

  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", user._id);

      const handleNotification = (data) => {
        const newNotif = {
          ...data,
          read: false,
          id: Date.now(),
        };
        setNotifications((prev) => [...prev, newNotif]);
      };

      socket.on("jobAccepted", handleNotification);
      socket.on("profileUpdate", handleNotification);
      socket.on("newPost", handleNotification);

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

    switch (notif.type) {
      case "job":
        router.push(`/orders`);
        break;
      case "profile":
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
              <BuildIcon fontSize="small" />
              <span>Trabalhar</span>
            </Link>
          )}

          {isLoggedIn && role !== "worker" && (
            <Link
              href="/orders"
              className="hover:underline whitespace-nowrap flex items-center gap-1"
            >
              <ListAltIcon fontSize="small" />
              <span>Pedidos</span>
            </Link>
          )}

          {isLoggedIn && firstName && (
            <span className="whitespace-nowrap font-medium">{firstName}</span>
          )}

          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative focus:outline-none"
              >
                <NotificationsIcon fontSize="small" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-8 right-0 bg-white text-black p-2 rounded shadow-lg w-64 z-50 text-xs sm:text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Notificações</span>
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={markAllAsRead}
                        className="text-gray-600 hover:text-gray-800 underline"
                      >
                        Marcar todas
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="text-red-600 hover:text-red-800 underline"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
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

          {isLoggedIn && (
            <Link href="/profile" className="flex items-center hover:underline">
              <AccountCircleIcon fontSize="small" />
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
