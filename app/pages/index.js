import Head from "next/head";
import Link from "next/link";
import { useTheme } from "/context/ThemeContext";
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
} from "lucide-react";
import styles from "/styles/Home.module.css";

export default function Home() {
  const { isDarkMode } = useTheme();

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
              <Link href="/recipt" className={styles.toolCard}>
                <div className={styles.toolIcon}>
                  <FileText size={32} />
                </div>
                <div className={styles.toolInfo}>
                  <h3 className={styles.toolTitle}>Comprovantes</h3>
                  <p className={styles.toolDescription}>
                    Gere comprovantes de forma simplificada
                  </p>
                </div>
                <ChevronRight className={styles.toolArrow} />
              </Link>

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

              <Link href="/kbase" className={styles.toolCard}>
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
              </Link>
            </div>
          </section>

          <div className={styles.twoColumnSection}>
            {/* Coluna da esquerda */}
            <section className={styles.knowledgeSection}>
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
            </section>

            {/* Coluna da direita */}
            <section className={styles.upcomingSection}>
              <div className={styles.sectionHeader}>
                <Clock className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Próximas Features</h2>
              </div>
              <div className={styles.card}>
                <div className={styles.upcomingList}>
                  <div className={styles.upcomingItem}>
                    <div className={styles.upcomingStatus}>
                      Em desenvolvimento
                    </div>
                    <h3 className={styles.upcomingTitle}>
                      <PlusCircle className={styles.upcomingIcon} />
                      Correções do tema Escuro
                    </h3>
                    <p className={styles.upcomingDescription}>
                      Algumas sessões que estão pendentes de FIX e validação,
                      ainda serão corrigidas conforme forem sendo identificadas.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
