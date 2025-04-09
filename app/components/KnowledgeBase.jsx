import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  Info,
  Users,
  Activity,
  Clock,
  HelpCircle,
  Copy,
  Check,
  SearchX,
  Loader,
} from "lucide-react";
import styles from "/styles/KnowledgeBase.module.css";
import { useTheme } from "/context/ThemeContext";

const KnowledgeBase = () => {
  const [errors, setErrors] = useState([]);
  const [filteredErrors, setFilteredErrors] = useState([]);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedError, setSelectedError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // Carregar dados do JSON
  useEffect(() => {
    const loadErrorData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/registros.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setErrors(data);
        setFilteredErrors(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadErrorData();
  }, []);

  // Filtrar erros com base na pesquisa e categoria
  useEffect(() => {
    if (errors.length === 0) return;

    const filtered = errors.filter((error) => {
      // Filtrar por categoria
      const categoryMatch =
        activeCategory === "todos" || error.categoria === activeCategory;

      // Se não há termo de busca, retornar apenas com base na categoria
      if (!searchTerm.trim()) return categoryMatch;

      // Pesquisar em vários campos
      const term = searchTerm.toLowerCase().trim();
      return (
        categoryMatch &&
        (error.codigo?.toLowerCase().includes(term) ||
          error.titulo?.toLowerCase().includes(term) ||
          error.causa?.toLowerCase().includes(term) ||
          error.orientacao?.toLowerCase().includes(term) ||
          error.gruposResolvedores?.some((grupo) =>
            grupo.toLowerCase().includes(term),
          ))
      );
    });

    setFilteredErrors(filtered);
  }, [searchTerm, activeCategory, errors]);

  // Obter todas as categorias únicas
  const getUniqueCategories = () => {
    if (!errors || errors.length === 0) return [];
    const categories = [
      ...new Set(errors.map((error) => error.categoria).filter(Boolean)),
    ];
    return categories;
  };

  // Função para formatar texto com links clicáveis
  const formatTextWithLinks = (text) => {
    if (!text) return "";

    // Garantir que o texto seja uma string
    const textStr = String(text);

    // Substituir URLs por links clicáveis
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedText = textStr.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="${styles.link}">${url}</a>`;
    });

    // Substituir quebras de linha por <br>
    return formattedText.replace(/\n/g, "<br>");
  };

  // Função para lidar com a abertura do modal
  const handleOpenModal = (errorCode) => {
    if (!errorCode) return;

    const error = errors.find((err) => err.codigo === errorCode);
    if (error) {
      setSelectedError(error);
      setIsModalOpen(true);

      // Animar a entrada do modal
      setTimeout(() => {
        setModalAnimation(true);
      }, 10);
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalAnimation(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedError(null);
    }, 300);
  };

  // Função para copiar as informações do erro
  const handleCopyErrorInfo = () => {
    if (!selectedError) return;

    const infoText = `Código: ${selectedError.codigo || ""}
Título: ${selectedError.titulo || ""}
Categoria: ${selectedError.categoria || ""}
Prioridade: ${selectedError.prioridade || ""}
Impacto: ${selectedError.impacto || ""}
Tempo Estimado: ${selectedError.tempoEstimado || ""}

Causa:
${selectedError.causa || ""}

Orientação:
${selectedError.orientacao || ""}

Grupos Resolvedores:
${(selectedError.gruposResolvedores || []).join(", ")}`;

    navigator.clipboard
      .writeText(infoText)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Erro ao copiar para a área de transferência:", err);
      });
  };

  // Função para obter ícone e classe de prioridade
  const getPriorityInfo = (priority) => {
    if (!priority) {
      return {
        icon: <Info size={16} className={styles.priorityIcon} />,
        className: styles.priorityLow,
      };
    }

    const priorityLower = priority.toLowerCase();

    switch (priorityLower) {
      case "crítica":
        return {
          icon: <AlertOctagon size={16} className={styles.priorityIcon} />,
          className: styles.priorityCritical,
        };
      case "alta":
        return {
          icon: <AlertTriangle size={16} className={styles.priorityIcon} />,
          className: styles.priorityHigh,
        };
      case "média":
        return {
          icon: <AlertCircle size={16} className={styles.priorityIcon} />,
          className: styles.priorityMedium,
        };
      default:
        return {
          icon: <Info size={16} className={styles.priorityIcon} />,
          className: styles.priorityLow,
        };
    }
  };

  // Manipulador para mudança de categoria
  const handleCategoryChange = (category) => {
    setActiveCategory(category || "todos");
  };

  // Manipulador para pesquisa
  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
  };

  // Limpar pesquisa
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className={styles.content}>
      {/* Título da Página */}
      <div className={`${styles.header} ${isDarkMode ? styles.darkTheme : ""}`}>
        <p className={styles.subtitle}>
          Encontre soluções para problemas comuns, códigos de erro e cenários de
          suporte
        </p>
      </div>

      {/* Barra de Busca */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Busque por código de erro, palavra-chave ou descrição..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className={styles.searchActions}>
            {filteredErrors.length > 0 && searchTerm.trim() !== "" && (
              <span className={styles.resultsCount}>
                {filteredErrors.length} resultado
                {filteredErrors.length !== 1 ? "s" : ""}
              </span>
            )}
            {searchTerm.trim() !== "" && (
              <button
                className={styles.clearButton}
                onClick={handleClearSearch}
                aria-label="Limpar pesquisa"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className={styles.tabsContainer}>
        <ul className={styles.tabsList}>
          <li>
            <button
              className={`${styles.tabButton} ${activeCategory === "todos" ? styles.activeTab : ""}`}
              onClick={() => handleCategoryChange("todos")}
            >
              Todos os Erros
            </button>
          </li>
          {getUniqueCategories().map((category) => (
            <li key={category}>
              <button
                className={`${styles.tabButton} ${activeCategory === category ? styles.activeTab : ""}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Área dos Resultados */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loader className={styles.loadingIcon} />
          <p className={styles.loadingText}>
            Carregando base de conhecimento...
          </p>
        </div>
      ) : filteredErrors.length === 0 ? (
        <div className={styles.noResultsContainer}>
          <SearchX className={styles.noResultsIcon} />
          <h3 className={styles.noResultsTitle}>Nenhum resultado encontrado</h3>
          <p className={styles.noResultsText}>
            Tente buscar por outro termo ou categoria
          </p>
        </div>
      ) : (
        <div className={styles.errorGrid}>
          {filteredErrors.map((error) => {
            if (!error || !error.codigo) return null;

            const { icon, className } = getPriorityInfo(error.prioridade);
            const briefCause =
              error.causa && error.causa.length > 120
                ? error.causa.substring(0, 120) + "..."
                : error.causa || "";

            return (
              <div key={error.codigo} className={styles.errorCard}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.errorCode}>{error.codigo}</span>
                    <span className={`${styles.priorityBadge} ${className}`}>
                      {icon}
                      {error.prioridade}
                    </span>
                  </div>
                  <h3 className={styles.errorTitle}>{error.titulo || ""}</h3>
                  <p className={styles.errorDescription}>{briefCause}</p>
                  <div className={styles.groupsContainer}>
                    {(error.gruposResolvedores || []).map((grupo, index) => (
                      <span key={index} className={styles.groupBadge}>
                        {grupo}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.categoryLabel}>
                    {error.categoria || ""}
                  </span>
                  <button
                    className={styles.detailsButton}
                    onClick={() => handleOpenModal(error.codigo)}
                  >
                    Ver detalhes
                    <ChevronRight size={16} className={styles.detailsIcon} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes - Versão simplificada para debugging */}
      {isModalOpen && selectedError && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalBackdrop}
            onClick={handleCloseModal}
          ></div>
          <div
            className={`${styles.modalContent} ${modalAnimation ? styles.modalActive : ""} ${isDarkMode ? styles.darkTheme : ""}`}
          >
            {/* Cabeçalho do Modal */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderContent}>
                <span className={styles.modalErrorCode}>
                  {selectedError.codigo || ""}
                </span>
                <h3 className={styles.modalTitle}>
                  {selectedError.titulo || ""}
                </h3>
              </div>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className={styles.modalBody}>
              {/* Prioridade e Impacto */}
              <div className={styles.metadataRow}>
                <div className={styles.metadataItem}>
                  <AlertTriangle size={20} className={styles.metadataIcon} />
                  <div>
                    <p className={styles.metadataLabel}>Prioridade</p>
                    <p className={styles.metadataValue}>
                      {selectedError.prioridade || ""}
                    </p>
                  </div>
                </div>
                <div className={styles.metadataItem}>
                  <Activity size={20} className={styles.metadataIcon} />
                  <div>
                    <p className={styles.metadataLabel}>Impacto</p>
                    <p className={styles.metadataValue}>
                      {selectedError.impacto || ""}
                    </p>
                  </div>
                </div>
                <div className={styles.metadataItem}>
                  <Clock size={20} className={styles.metadataIcon} />
                  <div>
                    <p className={styles.metadataLabel}>Tempo estimado</p>
                    <p className={styles.metadataValue}>
                      {selectedError.tempoEstimado || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Causa */}
              <div className={styles.sectionContainer}>
                <h4 className={styles.sectionTitle}>
                  <AlertCircle size={20} className={styles.sectionIcon} />
                  Causa do Problema
                </h4>
                <div className={styles.sectionContent}>
                  <p className={styles.sectionText}>
                    {selectedError.causa || ""}
                  </p>
                </div>
              </div>

              {/* Orientações */}
              <div className={styles.sectionContainer}>
                <h4 className={styles.sectionTitle}>
                  <HelpCircle size={20} className={styles.sectionIcon} />
                  Orientações de Solução
                </h4>
                <div className={styles.sectionContent}>
                  {selectedError.orientacao ? (
                    <div
                      className={styles.sectionText}
                      dangerouslySetInnerHTML={{
                        __html: formatTextWithLinks(selectedError.orientacao),
                      }}
                    />
                  ) : (
                    <p className={styles.sectionText}>
                      Não há orientações disponíveis.
                    </p>
                  )}
                </div>
              </div>

              {/* Grupos Resolvedores */}
              <div className={styles.sectionContainer}>
                <h4 className={styles.sectionTitle}>
                  <Users size={20} className={styles.sectionIcon} />
                  Grupos Resolvedores
                </h4>
                <div className={styles.groupsWrap}>
                  {(selectedError.gruposResolvedores || []).map(
                    (grupo, index) => (
                      <div key={index} className={styles.groupBadgeLarge}>
                        {grupo}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className={styles.modalFooter}>
              <span className={styles.modalCategory}>
                Categoria: <strong>{selectedError.categoria || ""}</strong>
              </span>
              <button
                className={styles.copyButton}
                onClick={handleCopyErrorInfo}
              >
                {copied ? (
                  <>
                    <Check size={16} className={styles.copyIcon} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={16} className={styles.copyIcon} />
                    Copiar informações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
