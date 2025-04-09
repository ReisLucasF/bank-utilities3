import React from "react";
import KnowledgeBase from "/components/KnowledgeBase";
import styles from "/styles/KnowledgeBase.module.css";

export default function CardCreatorPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Base de Conhecimento</h1>
      </div>
      <KnowledgeBase />
    </div>
  );
}
