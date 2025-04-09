import React from "react";
import ReceiptGenerator from "/components/ReceiptGenerator";
import styles from "/styles/ReceiptGenerator.module.css";

export default function recipt() {
  return (
    <div className={styles.pageContainer}>
      <ReceiptGenerator />
    </div>
  );
}
