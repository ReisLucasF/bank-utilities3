import React from "react";
import PopupCreator from "/components/PopupCreator";
import styles from "/styles/Page.module.css";

export default function PopupCreatorPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Criador de Popups</h1>
      </div>

      <PopupCreator />
    </div>
  );
}
