import React from "react";
import CardCreator from "/components/CardCreator";
import styles from "/styles/Page.module.css";

export default function CardCreatorPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Criador de Cards</h1>
      </div>
      <CardCreator />
    </div>
  );
}
