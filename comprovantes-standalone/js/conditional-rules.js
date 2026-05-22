/* Gerado automaticamente */
(function (global) {
  const raw = {
  "das": [
    {
      "id": "codigoBarras",
      "removePattern": "<tr[^>]*id=\"codigo\"[^>]*>.*?</tr>",
      "conditionSrc": "(formValues) => formValues.possuiCodigo === \"sim\""
    }
  ],
  "gps": [
    {
      "id": "codigoBarras",
      "removePattern": "<tr[^>]*id=\"codigo\"[^>]*>.*?</tr>",
      "conditionSrc": "(formValues) => formValues.possuiCodigo === \"sim\""
    }
  ],
  "dae": [
    {
      "id": "codigoBarras",
      "removePattern": "<tr[^>]*id=\"codigo\"[^>]*>.*?</tr>",
      "conditionSrc": "(formValues) => formValues.possuiCodigo === \"sim\""
    }
  ]
};
  global.RECEIPT_CONDITIONAL_RULES = {};
  for (const tipo of Object.keys(raw)) {
    global.RECEIPT_CONDITIONAL_RULES[tipo] = raw[tipo].map(function (rule) {
      return {
        id: rule.id,
        removePattern: rule.removePattern,
        condition: (0, eval)("(" + rule.conditionSrc + ")"),
      };
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
