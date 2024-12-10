import { MdDone as DoneIcon, MdDelete as DeleteIcon } from "react-icons/md";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  type: string;
  workerId?: string;
}

interface NotificationItemProps {
  notif: Notification;
  onMarkAsRead: (id: number) => void;
  onRemove: (id: number) => void;
  onClick: (notif: Notification) => void;
}

export const NotificationItem = ({
  notif,
  onMarkAsRead,
  onRemove,
  onClick,
}: NotificationItemProps) => {
  return (
    <div
      className={`p-2 rounded flex items-start gap-2 hover:bg-gray-100 cursor-pointer ${
        !notif.read ? "font-semibold" : "font-normal"
      }`}
    >
      <div onClick={() => onClick(notif)} className="flex-1">
        {notif.message}
      </div>
      <div className="flex items-center gap-1">
        {!notif.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notif.id);
            }}
            className="text-gray-500 hover:text-gray-700"
            title="Marcar como lida"
          >
            <DoneIcon size={16} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notif.id);
          }}
          className="text-red-500 hover:text-red-700"
          title="Remover notificação"
        >
          <DeleteIcon size={16} />
        </button>
      </div>
    </div>
  );
};
