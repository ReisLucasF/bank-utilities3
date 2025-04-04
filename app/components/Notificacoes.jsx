// components/Notificacoes.jsx
import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotificacoes } from "../contexts/NotificacaoContext";
import styles from "../styles/Notificacoes.module.css";

export default function Notificacoes() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, marcarTodasComoLidas, limparNotificacoes } =
    useNotificacoes();

  // Contagem de notificações não lidas
  const unreadCount = notifications.filter((n) => !n.lida).length;

  // Toggle para abrir/fechar as notificações
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    // Marcar notificações como lidas quando abrir o painel
    if (!showNotifications) {
      marcarTodasComoLidas();
    }
  };

  return (
    <div className={styles.notificationContainer}>
      <button
        onClick={toggleNotifications}
        className={styles.notificationButton}
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>{unreadCount}</span>
        )}
      </button>

      {/* Painel de notificações */}
      {showNotifications && (
        <div className={styles.notificationPanel}>
          <h3 className={styles.notificationTitle}>Notificações</h3>
          {notifications.length === 0 ? (
            <p className={styles.notificationEmpty}>Nenhuma notificação</p>
          ) : (
            <ul className={styles.notificationList}>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`${styles.notificationItem} ${!notif.lida ? styles.unread : ""}`}
                >
                  <div className={styles.notificationContent}>
                    <h4 className={styles.notificationHeader}>
                      {notif.titulo}
                    </h4>
                    <p className={styles.notificationMessage}>
                      {notif.mensagem}
                    </p>
                  </div>
                  <span className={styles.notificationTime}>{notif.hora}</span>
                </li>
              ))}
            </ul>
          )}
          {notifications.length > 0 && (
            <button
              className={styles.clearNotifications}
              onClick={limparNotificacoes}
            >
              Limpar todas
            </button>
          )}
        </div>
      )}
    </div>
  );
}
