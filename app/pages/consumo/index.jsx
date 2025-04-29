import React from "react";
import Consumo from "/components/Consumo";
import styles from "/styles/ReceiptGenerator.module.css";

export default function recipt() {
  return (
    <div className={styles.pageContainer}>
      <Consumo />
    </div>
  );
}
