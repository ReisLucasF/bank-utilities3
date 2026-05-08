import Head from "next/head";
import Link from "next/link";
import { useTheme } from "/context/ThemeContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FileText,
  MessageSquare,
  Smartphone,
  Database,
  ChevronRight,
  Book,
  Shield,
  BarChart,
  FileJson,
  PlusCircle,
  Lightbulb,
  Zap,
  Clock,
  Rocket,
} from "lucide-react";
import styles from "/styles/Home.module.css";

export default function Home() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isReceiptsOpen, setIsReceiptsOpen] = useState(false);
  const [receiptItems, setReceiptItems] = useState([]);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);

  const receiptsTitle = useMemo(
    () => (isLoadingReceipts ? "Carregando comprovantes..." : "Comprovantes"),
    [isLoadingReceipts],
  );

  useEffect(() => {
    if (!isReceiptsOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsReceiptsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isReceiptsOpen]);

  useEffect(() => {
    if (!isReceiptsOpen) return;
    if (receiptItems.length > 0) return;

    setIsLoadingReceipts(true);
    fetch("/api/comprovantes")
      .then((r) => r.json())
      .then((data) => setReceiptItems(Array.isArray(data?.itens) ? data.itens : []))
      .catch(() => setReceiptItems([]))
      .finally(() => setIsLoadingReceipts(false));
  }, [isReceiptsOpen, receiptItems.length]);

  return (
    <>
      <Head>
        <title>Bank Utilities</title>
        <meta
          name="description"
          content="Ferramentas para facilitar o trabalho dos colaboradores bancários"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`${styles.homeContainer} ${isDarkMode ? styles.darkTheme : ""}`}
      >
        <div className={styles.contentWrapper}>
          {/* Seção de Destaques */}
          <section className={styles.quickAccessSection}>
            <div className={styles.sectionHeader}>
              <Zap className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
            </div>
            <div className={styles.toolsGrid}>
              <button
                type="button"
                className={styles.toolCardButton}
                onClick={() => setIsReceiptsOpen(true)}
              >
                <div className={styles.toolIcon}>
                  <FileText size={32} />
                </div>
                <div className={styles.toolInfo}>
                  <h3 className={styles.toolTitle}>{receiptsTitle}</h3>
                  <p className={styles.toolDescription}>
                    Gere comprovantes de forma simplificada
                  </p>
                </div>
                <ChevronRight className={styles.toolArrow} />
              </button>

              <Link href="/card-creator" className={styles.toolCard}>
                <div className={styles.toolIcon}>
                  <MessageSquare size={32} />
                </div>
                <div className={styles.toolInfo}>
                  <h3 className={styles.toolTitle}>Scripts Card</h3>
                  <p className={styles.toolDescription}>
                    Crie scripts para Cards com mockup preview.
                  </p>
                </div>
                <ChevronRight className={styles.toolArrow} />
              </Link>

              <Link href="/popup-creator" className={styles.toolCard}>
                <div className={styles.toolIcon}>
                  <Smartphone size={32} />
                </div>
                <div className={styles.toolInfo}>
                  <h3 className={styles.toolTitle}>Script Pop-up</h3>
                  <p className={styles.toolDescription}>
                    Crie scripts para Pop-up com mockup preview.
                  </p>
                </div>
                <ChevronRight className={styles.toolArrow} />
              </Link>

              {/* <Link href="/kbase" className={styles.toolCard}>
                <div className={styles.toolIcon}>
                  <Database size={32} />
                </div>
                <div className={styles.toolInfo}>
                  <h3 className={styles.toolTitle}>Base de Conhecimento</h3>
                  <p className={styles.toolDescription}>
                    Consulte soluções para problemas comuns
                  </p>
                </div>
                <ChevronRight className={styles.toolArrow} />
              </Link> */}
            </div>
          </section>

          <div className={styles.twoColumnSection}>
            {/* Coluna da esquerda */}
            {/* <section className={styles.knowledgeSection}>
              <div className={styles.sectionHeader}>
                <Book className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Base de Conhecimento</h2>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Recursos Disponíveis</h3>
                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <Shield className={styles.featureIcon} />
                    <span>Erros comuns e soluções documentadas</span>
                  </li>
                  <li className={styles.featureItem}>
                    <MessageSquare className={styles.featureIcon} />
                    <span>Casos especiais e procedimentos</span>
                  </li>
                </ul>
                <Link href="/kbase" className={styles.cardButton}>
                  Acessar Base de Conhecimento
                </Link>
              </div>
            </section> */}

            {/* Coluna da direita */}
            <section className={styles.upcomingSection}>
              <div className={styles.sectionHeader}>
                <Rocket className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Atualizações</h2>
              </div>
              <div className={styles.card}>
                <div className={styles.upcomingList}>
                  <div className={styles.upcomingItem}>
                    <div className={styles.upcomingStatus}>Lançada 08/05/2026</div>
                    <h3 className={styles.upcomingTitle}>
                      <PlusCircle className={styles.upcomingIcon} />
                      Correção na geração de comprovantes
                    </h3>
                    <p className={styles.upcomingDescription}>
                      Notamos que alguns comprovantes estavam vindo com mais de 44 caracteres, o que estava causando erros na geração do comprovante.
                      Corrigimos o problema e agora os comprovantes estão sendo gerados corretamente.
                    </p>
                  </div>
                  <div className={styles.upcomingItem}>
                    <div className={styles.upcomingStatus}>Lançada 12/03/2026</div>
                    <h3 className={styles.upcomingTitle}>
                      <PlusCircle className={styles.upcomingIcon} />
                      Preview de scripts popup
                    </h3>
                    <p className={styles.upcomingDescription}>
                      Adicionamos um preview de scripts que faz a engenharia reversa do script para o popup, gerando a imagem com base no txt gerado.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </div>

      {isReceiptsOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Selecione um comprovante"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsReceiptsOpen(false);
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Selecione o tipo de comprovante</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setIsReceiptsOpen(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {isLoadingReceipts ? (
                <p className={styles.modalHint}>Carregando lista…</p>
              ) : receiptItems.length === 0 ? (
                <p className={styles.modalHint}>
                  Não foi possível carregar os comprovantes. Tente novamente.
                </p>
              ) : (
                <div className={styles.modalGrid}>
                  {receiptItems.map((item) => (
                    <button
                      key={item.tipo}
                      type="button"
                      className={styles.modalItem}
                      onClick={() => {
                        setIsReceiptsOpen(false);
                        router.push(item.href);
                      }}
                    >
                      <div className={styles.modalItemTitle}>{item.title}</div>
                      {item.subtitle ? (
                        <div className={styles.modalItemSubtitle}>{item.subtitle}</div>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
