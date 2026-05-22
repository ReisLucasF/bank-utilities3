/**
 * Utilitários compartilhados (index, comprovante, embed).
 */
(function (global) {
  "use strict";

  function getDisplayLabel(tipo, cfg) {
    cfg = cfg || {};
    if (cfg.displayLabel) return cfg.displayLabel;
    var raw = cfg.title || tipo || "";
    var stripped = raw.replace(/^Gerar Comprovante\s*[-–—]\s*/i, "").trim();
    return stripped || raw || tipo;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.ReceiptUtils = {
    getDisplayLabel: getDisplayLabel,
    escapeHtml: escapeHtml,
  };
})(typeof window !== "undefined" ? window : globalThis);
