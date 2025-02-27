// Step 1: Define the Notification interface.
interface Notification {
  id: string;
  roomId: string;
  message: string;
  createdAt: string;
}

// Step 2: Create a NotificationList component to render notifications.
const NotificationList: React.FC<{ notifications: Notification[] }> = ({
  notifications,
}) => {
  return (
    <div className="fixed right-4 top-4 z-50 rounded bg-white p-4 shadow-lg">
      <h4 className="mb-2 font-bold">Notifications</h4>
      {notifications.length === 0 && <p>No notifications</p>}
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id} className="border-b py-1">
            <p>{notif.message}</p>
            <span className="text-xs text-gray-400">
              {new Date(notif.createdAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
