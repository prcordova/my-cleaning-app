import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdNotifications as NotificationsIcon } from "react-icons/md";
import { NotificationItem } from "./NotificationItem";
import { baseUrl } from "@/services/api";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  type: string;
  workerId?: string;
}

interface NotificationMenuProps {
  userId: string;
  token: string;
}

export const NotificationMenu = ({ userId, token }: NotificationMenuProps) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  // Carrega notificações iniciais
  useEffect(() => {
    if (userId && token) {
      fetch(`${baseUrl}/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
        });
    }
  }, [userId, token]);

  // Socket para novas notificações seria configurado aqui se necessário.

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = async () => {
    setNotifications([]);
    if (!userId || !token) return;

    await fetch(`${baseUrl}/notifications/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setShowMenu(false);
  };

  const handleNotificationClick = (notif: Notification) => {
    // Marca como lida
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    // Redireciona conforme o tipo da notificação
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

    setShowMenu(false);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleRemove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative h-[20px] items-center">
      <button onClick={toggleMenu} className="relative focus:outline-none">
        <NotificationsIcon size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showMenu && (
        <div className="absolute top-8 right-0 bg-white text-black p-2 rounded shadow-lg w-64 z-50 text-xs sm:text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Notificações</span>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Marcar todas
              </button>
              <button
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-800 underline"
              >
                Limpar
              </button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <div key={notifications.length} className="text-gray-500">
                Sem notificações
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onMarkAsRead={handleMarkAsRead}
                  onRemove={handleRemove}
                  onClick={handleNotificationClick}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
