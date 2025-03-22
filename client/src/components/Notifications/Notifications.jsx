import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received from John Doe", read: false },
    { id: 2, message: "User feedback submitted by Jane Smith", read: false },
    { id: 3, message: "System update completed successfully", read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className={notification.read ? "read" : "unread"}>
            <span>{notification.message}</span>
            <div className="actions">
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              )}
              <button onClick={() => deleteNotification(notification.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;