import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "/styles/Layout.module.css";
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Brain,
  ChevronDown,
  ChevronRight,
  Target,
  FileCheck,
  FileCode,
  Home,
} from "lucide-react";
import { useTheme } from "/context/ThemeContext";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

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
      const storedSidebarOpen = sessionStorage.getItem("sidebarOpen");
      if (storedSidebarOpen !== null) {
        setSidebarOpen(storedSidebarOpen === "true");
      } else {
        setSidebarOpen(false);
      }

      // Recuperar estado dos dropdowns
      const storedExpandedMenus = sessionStorage.getItem("expandedMenus");
      if (storedExpandedMenus) {
        try {
          setExpandedMenus(JSON.parse(storedExpandedMenus));
        } catch (e) {
          console.error("Erro ao carregar estado dos menus:", e);
        }
      }
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setSidebarOpen(newState);
    sessionStorage.setItem("sidebarOpen", newState.toString());
  };

  const toggleDropdown = (menuId) => {
    const newExpandedMenus = {
      ...expandedMenus,
      [menuId]: !expandedMenus[menuId],
    };
    setExpandedMenus(newExpandedMenus);
    sessionStorage.setItem("expandedMenus", JSON.stringify(newExpandedMenus));
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
            <h1 className={styles.title}>Bank Utilities</h1>
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
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {/* Sidebar */}
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
                    <Home size={20} />
                  </span>
                  <span className={styles.navText}>Home</span>
                </Link>
              </li>

              {/* Dropdown: Ação Comercial */}
              <li
                className={`${styles.navItem} ${
                  expandedMenus["acaoComercial"] ? styles.navItemActive : ""
                }`}
              >
                <button
                  onClick={() => toggleDropdown("acaoComercial")}
                  className={styles.dropdownButton}
                >
                  <span className={styles.navIcon}>
                    <Target size={20} />
                  </span>
                  <span className={styles.navText}>Ação Comercial</span>
                  <span className={styles.dropdownIcon}>
                    {expandedMenus["acaoComercial"] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                </button>

                {/* Submenu de Ação Comercial */}
                <ul
                  className={`${styles.submenu} ${
                    expandedMenus["acaoComercial"] ? styles.submenuExpanded : ""
                  }`}
                >
                  <li className={styles.submenuItem}>
                    <Link href="/card-creator" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>Card</span>
                    </Link>
                  </li>
                  <li className={styles.submenuItem}>
                    <Link href="/popup-creator" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>Popup</span>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Dropdown: Comprovantes */}
              <li
                className={`${styles.navItem} ${
                  expandedMenus["comprovantes"] ? styles.navItemActive : ""
                }`}
              >
                <button
                  onClick={() => toggleDropdown("comprovantes")}
                  className={styles.dropdownButton}
                >
                  <span className={styles.navIcon}>
                    <FileCheck size={20} />
                  </span>
                  <span className={styles.navText}>Comprovantes</span>
                  <span className={styles.dropdownIcon}>
                    {expandedMenus["comprovantes"] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                </button>

                {/* Submenu de Comprovantes */}
                <ul
                  className={`${styles.submenu} ${
                    expandedMenus["comprovantes"] ? styles.submenuExpanded : ""
                  }`}
                >
                  <li className={styles.submenuItem}>
                    <Link href="/ficha" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>
                        Ficha Compensação
                      </span>
                    </Link>
                  </li>
                  <li className={styles.submenuItem}>
                    <Link href="/consumo" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>Consumo</span>
                    </Link>
                  </li>
                  <li className={styles.submenuItem}>
                    <Link href="/fgts" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>FGTS</span>
                    </Link>
                  </li>
                  <li className={styles.submenuItem}>
                    <Link href="/gps" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>GPS</span>
                    </Link>
                  </li>
                  <li className={styles.submenuItem}>
                    <Link
                      href="/tributo_municipal"
                      className={styles.submenuLink}
                    >
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>
                        Tributo Municipal
                      </span>
                    </Link>
                  </li>
                  <li className={styles.submenuItem}>
                    <Link href="/dae" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>DAE</span>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Dropdown: Liberação */}
              <li
                className={`${styles.navItem} ${
                  expandedMenus["liberacao"] ? styles.navItemActive : ""
                }`}
              >
                <button
                  onClick={() => toggleDropdown("liberacao")}
                  className={styles.dropdownButton}
                >
                  <span className={styles.navIcon}>
                    <FileCode size={20} />
                  </span>
                  <span className={styles.navText}>Liberação</span>
                  <span className={styles.dropdownIcon}>
                    {expandedMenus["liberacao"] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                </button>

                {/* Submenu de Liberação */}
                <ul
                  className={`${styles.submenu} ${
                    expandedMenus["liberacao"] ? styles.submenuExpanded : ""
                  }`}
                >
                  <li className={styles.submenuItem}>
                    <Link href="/liberacao" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>
                        Script Convencional
                      </span>
                    </Link>
                  </li>

                  <li className={styles.submenuItem}>
                    <Link href="/liberacao-atm" className={styles.submenuLink}>
                      <span className={styles.submenuIcon}></span>
                      <span className={styles.submenuText}>Script ATM</span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className={styles.navItem}>
                <Link href="/kbase" className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <Brain size={20} />
                  </span>
                  <span className={styles.navText}>Base de Conhecimento</span>
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
          © {new Date().getFullYear()} Bank Utilities - Todos os direitos
          reservados. | v1.0.5
        </p>
      </footer>
    </div>
  );
}
