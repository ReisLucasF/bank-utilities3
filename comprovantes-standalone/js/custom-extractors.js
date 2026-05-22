/* Gerado automaticamente */
(function (global) {
  const raw = {
  "dae": {
    "agenciaConta": "(textContent) => {\r\n      const agenciaRecebedoraMatch = textContent.match(\r\n        /Agencia recebedora\\s*:\\s*(\\d+)/i,\r\n      );\r\n      const contaMatch = textContent.match(\r\n        /Conta para Debito\\s*:\\s*([^\\n]+)\\b/i,\r\n      );\r\n\r\n      if (agenciaRecebedoraMatch && contaMatch) {\r\n        return `${agenciaRecebedoraMatch[1]}/${contaMatch[1]}`;\r\n      }\r\n      return \"\";\r\n    }",
    "nome": "(textContent) => {\r\n      const nomeMatch = textContent.match(/Nome do cliente\\s*:\\s*(.+)/i);\r\n      return nomeMatch ? nomeMatch[1] : \"\";\r\n    }",
    "docDae": "(textContent) => {\r\n      const codigoBarrasMatch = textContent.match(\r\n        /Codigo de Barras\\s*:\\s*(\\d{44})/i,\r\n      );\r\n      if (codigoBarrasMatch && codigoBarrasMatch[1]) {\r\n        // Extrai os 13 dígitos do código de barras que correspondem ao número do documento DAE\r\n        return codigoBarrasMatch[1].slice(-17, -4);\r\n      }\r\n      return \"\";\r\n    }"
  },
  "ficha": {
    "cpfCnpj": "(textContent) => {\r\n      const cpfcnpjMatch = textContent.match(\r\n        /CPF\\/CNPJ do sacado\\s*:\\s*(\\d+)/i,\r\n      );\r\n      if (cpfcnpjMatch && cpfcnpjMatch[1]) {\r\n        const numero = cpfcnpjMatch[1];\r\n\r\n        if (/^\\d{14}$/.test(numero) && /^[1-9]/.test(numero.substr(0, 3))) {\r\n          // Se o número tem exatamente 14 dígitos e os três primeiros não são zero, é CNPJ\r\n          return numero.replace(\r\n            /(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})/,\r\n            \"$1.$2.$3/$4-$5\",\r\n          );\r\n        } else {\r\n          // Do contrário CPF\r\n          return numero\r\n            .substr(3)\r\n            .replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{2})/, \"$1.$2.$3-$4\");\r\n        }\r\n      }\r\n      return \"\";\r\n    }"
  },
  "tributo_municipal": {
    "agenciaConta": "(textContent) => {\r\n      const agenciaRecebedoraMatch = textContent.match(\r\n        /Agencia recebedora\\s*:\\s*(\\d+)/i,\r\n      );\r\n      const contaMatch = textContent.match(\r\n        /Conta para Debito\\s*:\\s*([^\\n]+)\\b/i,\r\n      );\r\n\r\n      if (agenciaRecebedoraMatch && contaMatch) {\r\n        return `${agenciaRecebedoraMatch[1]}/${contaMatch[1]}`;\r\n      }\r\n      return \"\";\r\n    }",
    "nome": "(textContent) => {\r\n      const nomeMatch = textContent.match(/Nome do cliente\\s*:\\s*(.+)/i);\r\n      return nomeMatch ? nomeMatch[1] : \"\";\r\n    }"
  },
  "dare_sp": {
    "controleDARE": "(textContent) => {\n      const m = textContent.match(/Numero de controle\\s*:\\s*(.+)/i);\n      return m ? m[1].trim() : \"\";\n    }"
  },
  "ipva_mg": {
    "vencimento": "(textContent) => {\n      const m = textContent.match(/Data de vencimento\\s*:\\s*([^\\n]+)\\b/i);\n      return m ? m[1].trim() : \"\";\n    }",
    "exercicio": "(textContent) => {\n      const m = textContent.match(/Ano de Exercicio\\s*:\\s*([^\\n]+)\\b/i);\n      return m ? m[1].trim() : \"\";\n    }",
    "renavam": "(textContent) => {\n      const m = textContent.match(/Codigo RENAVAM\\s*:\\s*([^\\n]+)\\b/i);\n      return m ? m[1].trim() : \"\";\n    }",
    "cotaParcela": "(textContent) => {\n      const m = textContent.match(/Numero da Parcela\\s*:\\s*([^\\n]+)\\b/i);\n      if (!m) return \"\";\n      const c = String(m[1]).trim();\n      if (c === \"1\") return \"1ª parcela\";\n      if (c === \"2\") return \"2ª parcela\";\n      if (c === \"3\") return \"3ª parcela\";\n      if (c === \"4\") return \"Valor inferior ao mínimo (cota única sem desconto)\";\n      return \"Cota única (com desconto)\";\n    }"
  }
};
  global.RECEIPT_CUSTOM_EXTRACTORS = {};
  for (const tipo of Object.keys(raw)) {
    global.RECEIPT_CUSTOM_EXTRACTORS[tipo] = {};
    for (const key of Object.keys(raw[tipo])) {
      global.RECEIPT_CUSTOM_EXTRACTORS[tipo][key] = (0, eval)("(" + raw[tipo][key] + ")");
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
