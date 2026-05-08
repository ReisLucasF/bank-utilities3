import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomizableReceiptGenerator from "/components/CustomizableReceiptGenerator";
import styles from "/styles/ReceiptGenerator.module.css";

const TIPOS_VALIDOS = new Set([
  "consumo",
  "das",
  "fgts",
  "gps",
  "dae",
  "ficha",
  "tributo_municipal",
]);

const carregarConfig = (tipo) => {
  switch (tipo) {
    case "consumo":
      return import("../consumo/index").then((m) => m.utilityBillReceiptConfig);
    case "das":
      return import("../das/index").then((m) => m.dasReceiptConfig);
    case "fgts":
      return import("../fgts/index").then((m) => m.fgtsReceiptConfig);
    case "gps":
      return import("../gps/index").then((m) => m.gpsReceiptConfig);
    case "dae":
      return import("../dae/index").then((m) => m.daeDafReceiptConfig);
    case "ficha":
      return import("../ficha/index").then((m) => m.compensationSlipReceiptConfig);
    case "tributo_municipal":
      return import("../tributo_municipal/index").then(
        (m) => m.municipalTaxReceiptConfig,
      );
    default:
      return Promise.resolve(null);
  }
};

const ComprovantePorTipo = () => {
  const router = useRouter();
  const raw = router.query.tipo;
  const tipo = Array.isArray(raw) ? raw[0] : raw;

  const [config, setConfig] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof tipo !== "string" || !TIPOS_VALIDOS.has(tipo)) {
      setConfig(null);
      setErro("Tipo inválido.");
      return;
    }
    setErro(null);
    setConfig(null);
    carregarConfig(tipo)
      .then((c) => {
        if (!c) {
          setErro("Não foi possível carregar a configuração.");
          return;
        }
        setConfig(c);
      })
      .catch(() => setErro("Erro ao carregar o comprovante."));
  }, [router.isReady, tipo]);

  if (!router.isReady) {
    return (
      <section className={styles.container}>
        <p className={styles.subtitle}>Carregando…</p>
      </section>
    );
  }

  if (erro) {
    return (
      <section className={styles.container}>
        <p className={styles.subtitle}>{erro}</p>
        <p className={styles.noDataMessage}>
          Use uma URL como <code>/comprovante/consumo</code>,{" "}
          <code>/comprovante/das</code>, <code>/comprovante/gps</code>, etc.
        </p>
      </section>
    );
  }

  if (!config) {
    return (
      <section className={styles.container}>
        <p className={styles.subtitle}>Carregando comprovante…</p>
      </section>
    );
  }

  return <CustomizableReceiptGenerator config={config} />;
};

export default ComprovantePorTipo;
