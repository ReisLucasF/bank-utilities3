import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Layout.module.css";
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = sessionStorage.getItem("theme");
      if (storedTheme) {
        setIsDarkMode(storedTheme === "dark");
      }

      const storedSidebarOpen = sessionStorage.getItem("sidebarOpen");
      if (storedSidebarOpen !== null) {
        setSidebarOpen(storedSidebarOpen === "true");
      } else {
        setSidebarOpen(false);
      }

      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setSidebarOpen(newState);
    sessionStorage.setItem("sidebarOpen", newState.toString());
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    sessionStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  };

  return (
    <div
      className={`${styles.container} ${isDarkMode ? styles.darkTheme : ""}`}
    >
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarContent}>
          <div className={styles.topbarLeft}>
            {/* Botão de toggle da sidebar (hamburguer) */}
            <button
              onClick={toggleSidebar}
              className={styles.menuButton}
              aria-label={isSidebarOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className={styles.title}>Minha Aplicação</h1>
          </div>
          <div className={styles.topbarRight}>
            {/* Botão de tema */}
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label={
                isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className={styles.userName}>Usuário</span>
            <button className={styles.logoutButton}>
              <LogOut size={16} className={styles.logoutIcon} />
              <span className={styles.logoutText}>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {/* Sidebar - visível apenas quando isSidebarOpen é verdadeiro */}
        <aside
          className={`
          ${styles.sidebar} 
          ${!isSidebarOpen ? styles.sidebarClosed : ""} 
          ${isMobile ? styles.mobileSidebar : ""}
        `}
        >
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <LayoutDashboard size={20} />
                  </span>
                  <span className={styles.navText}>Dashboard</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/produtos" className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <Package size={20} />
                  </span>
                  <span className={styles.navText}>Produtos</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/clientes" className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <Users size={20} />
                  </span>
                  <span className={styles.navText}>Clientes</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/pedidos" className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <ShoppingCart size={20} />
                  </span>
                  <span className={styles.navText}>Pedidos</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/configuracoes" className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <Settings size={20} />
                  </span>
                  <span className={styles.navText}>Configurações</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`
          ${styles.main} 
          ${isSidebarOpen ? styles.mainWithSidebar : ""}
        `}
        >
          {/* Overlay quando o sidebar está aberto apenas em dispositivos móveis */}
          {isMobile && isSidebarOpen && (
            <div className={styles.overlay} onClick={toggleSidebar}></div>
          )}
          <div className={styles.mainContent}>{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Minha Aplicação - Todos os direitos
          reservados
        </p>
      </footer>
    </div>
  );
}
