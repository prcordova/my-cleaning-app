"use client";
import { useState, useEffect } from "react";
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

  // Agora as notificações serão um array de objetos: {message, jobId, workerId, read, id}
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", user._id);

      socket.on("jobAccepted", (data) => {
        // data: { message, jobId, workerId }
        // Adicionamos read: false e um id único
        const newNotif = {
          ...data,
          read: false,
          id: Date.now(), // um id único simples baseado na timestamp
        };
        setNotifications((prev) => [...prev, newNotif]);
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

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleNotificationClick = (notif) => {
    // Ao clicar na notificação, marcamos como lida
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    // E redirecionamos para o perfil do trabalhador
    if (notif.workerId) {
      router.push(`/worker-profile/${notif.workerId}`);
    }
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center relative">
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
