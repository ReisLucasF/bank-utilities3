/**
 * Motor de geração de comprovantes — HTML + JS puro (sem React).
 * Depende de: html2pdf.js, RECEIPT_CONFIGS, RECEIPT_CONDITIONAL_RULES, RECEIPT_CUSTOM_EXTRACTORS
 */
(function (global) {
  "use strict";

  var SVG = {
    arrowLeft:
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
    fileText:
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    check:
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    info:
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    help:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  var SVG_EXTRA = {
    clipboard:
      '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
    scan:
      '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    list:
      '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    download:
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  };

  function escapeHtml(str) {
    if (global.ReceiptUtils) return global.ReceiptUtils.escapeHtml(str);
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getDisplayLabel(tipo, cfg) {
    if (global.ReceiptUtils) return global.ReceiptUtils.getDisplayLabel(tipo, cfg);
    cfg = cfg || {};
    if (cfg.displayLabel) return cfg.displayLabel;
    var raw = cfg.title || tipo || "";
    return raw.replace(/^Gerar Comprovante\s*[-–—]\s*/i, "").trim() || raw || tipo;
  }

  function mergeConfig(tipo, config) {
    var base = config || (global.RECEIPT_CONFIGS && global.RECEIPT_CONFIGS[tipo]);
    if (!base) return null;
    var cfg = JSON.parse(JSON.stringify(base));
    cfg.receiptTemplate = base.receiptTemplate;
    cfg.conditionalFields =
      (global.RECEIPT_CONDITIONAL_RULES && global.RECEIPT_CONDITIONAL_RULES[tipo]) ||
      base.conditionalFields ||
      [];
    cfg.customExtractors =
      (global.RECEIPT_CUSTOM_EXTRACTORS && global.RECEIPT_CUSTOM_EXTRACTORS[tipo]) ||
      base.customExtractors ||
      {};
    return cfg;
  }

  function ReceiptEngine(container, config, options) {
    this.container =
      typeof container === "string" ? document.querySelector(container) : container;
    this.config = config;
    this.options = options || {};
    this.tipo = options.tipo || "";
    this.logText = "";
    this.formValues = {};
    this.extractedData = {};
    this.isDataExtracted = false;
    this.isButtonDisabled = true;
    this.buttonSuccess = false;
    this.refs = {};
    this.minBarcodeLen = config.minBarcodeLength != null ? config.minBarcodeLength : 44;
    this.initFormValues();
  }

  ReceiptEngine.prototype.initFormValues = function () {
    var self = this;
    (this.config.formFields || []).forEach(function (field) {
      self.formValues[field.id] = field.defaultValue || "";
    });
  };

  ReceiptEngine.prototype.isBarcodeRequired = function () {
    if (this.config.requireBarcode === false) return false;
    if (this.formValues.possuiCodigo === "nao") return false;
    return true;
  };

  ReceiptEngine.prototype.applyButtonState = function (newData) {
    if (!this.logText.trim() || Object.keys(newData).length === 0) {
      this.isButtonDisabled = true;
      return;
    }
    if (this.isBarcodeRequired()) {
      var codigo = newData.codigoBarras;
      if (!codigo || String(codigo).length < this.minBarcodeLen) {
        this.isButtonDisabled = true;
        return;
      }
    }
    var fields = this.config.formFields || [];
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f.required && !String(this.formValues[f.id] || "").trim()) {
        this.isButtonDisabled = true;
        return;
      }
    }
    this.isButtonDisabled = false;
  };

  ReceiptEngine.prototype.extractCommonData = function (textContent, newData) {
    var m;

    m = textContent.match(/Valor (do documento|liquido a debitar)\s*:\s*R\$\s*([\d,.]+)/i);
    if (m && m[2]) {
      var valor = parseFloat(m[2].replace(",", "."));
      newData.valorDocumento = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    m = textContent.match(/Codigo de Barras\s*:\s*(\d+)/i);
    if (m && m[1]) newData.codigoBarras = m[1];

    m = textContent.match(/Nsu\s*:\s*(\d+)/i);
    if (m && m[1]) newData.nsu = m[1];

    m = textContent.match(/Data do movimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
    if (m) newData.dataPagamento = m[1] + "/" + m[2] + "/" + m[3];

    m = textContent.match(/Data de vencimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
    if (m) newData.dataVencimento = m[1] + "/" + m[2] + "/" + m[3];

    m = textContent.match(/Nome do cliente\s*:\s*(.+)/i);
    if (m && m[1]) newData.nome = m[1];

    m = textContent.match(/Agencia recebedora\s*:\s*(\d+)/i);
    var contaMatch = textContent.match(/Conta para Debito\s*:\s*([^\n]+)\b/i);
    if (m && contaMatch) newData.agenciaConta = m[1] + "/" + contaMatch[1];

    m = textContent.match(/Data de competencia\s*:\s*(\d{2})(\d{4})/i);
    if (m) newData.competencia = m[1] + "/" + m[2];

    m = textContent.match(/Codigo do Convenio\s*:\s*(\d+)/i);
    if (m) {
      var cv = m[1];
      var validos = ["12173", "12157", "12190", "1221", "12513"];
      var fmt = validos.indexOf(cv) >= 0
        ? "0180 - com centralização ou com tomador"
        : cv === "00116"
          ? "418 - FGTS / GFIP"
          : cv === "13617"
            ? "411 - FGTS / GFIP"
            : cv === "14010"
              ? "412 - FGTS / GFIP"
              : cv;
      newData.convenio = fmt;
      if (Object.prototype.hasOwnProperty.call(this.formValues, "convenio") && !this.formValues.convenio) {
        this.formValues.convenio = fmt;
      }
    }
  };

  ReceiptEngine.prototype.previewExtractedInfo = function () {
    var textContent = this.logText.trim();
    if (!textContent) {
      this.isDataExtracted = false;
      this.isButtonDisabled = true;
      this.renderPreview();
      return;
    }

    var newData = {};
    this.extractCommonData(textContent, newData);

    var extractors = this.config.customExtractors || {};
    Object.keys(extractors).forEach(function (key) {
      try {
        var val = extractors[key](textContent);
        if (val !== undefined) newData[key] = val;
      } catch (e) {
        console.error("Extrator " + key + ":", e);
      }
    });

    if (Object.keys(newData).length > 0) {
      this.extractedData = newData;
      this.isDataExtracted = true;
    } else {
      this.extractedData = {};
      this.isDataExtracted = false;
    }
    this.applyButtonState(newData);
    this.renderPreview();
    this.updateButton();
    this.renderFormFields();
  };

  ReceiptEngine.prototype.validateForm = function () {
    var isValid = true;
    var errorMessage = "";
    var logArea = this.refs.logText;

    if (!this.logText.trim()) {
      if (logArea) logArea.classList.add("rg-input-error");
      return { isValid: false, errorMessage: "Por favor, cole o LOG da transação para gerar o comprovante." };
    }
    if (logArea) logArea.classList.remove("rg-input-error");

    var valorMatch = this.logText.match(/Valor (do documento|liquido a debitar)\s*:\s*R\$\s*([\d,.]+)/i);
    var codigoBarrasMatch = this.logText.match(/Codigo de Barras\s*:\s*(\d+)/i);
    var nsuMatch = this.logText.match(/Nsu\s*:\s*(\d+)/i);

    if (!valorMatch && !codigoBarrasMatch && !nsuMatch) {
      if (logArea) logArea.classList.add("rg-input-error");
      return {
        isValid: false,
        errorMessage: "O LOG não contém informações suficientes. Verifique se o formato está correto.",
      };
    }

    if (this.isBarcodeRequired()) {
      if (!codigoBarrasMatch || !codigoBarrasMatch[1]) {
        if (logArea) logArea.classList.add("rg-input-error");
        return {
          isValid: false,
          errorMessage: "O LOG deve conter a linha 'Codigo de Barras' com os dígitos do boleto.",
        };
      }
      if (codigoBarrasMatch[1].length < this.minBarcodeLen) {
        if (logArea) logArea.classList.add("rg-input-error");
        return {
          isValid: false,
          errorMessage: "O código de barras deve ter pelo menos " + this.minBarcodeLen + " caracteres.",
        };
      }
    }

    var fields = this.config.formFields || [];
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var el = this.refs[field.id];
      if (field.required && !this.formValues[field.id]) {
        if (el) el.classList.add("rg-input-error");
        errorMessage = errorMessage || "Por favor, preencha o campo " + field.label + ".";
        isValid = false;
      } else if (el) {
        el.classList.remove("rg-input-error");
      }
    }

    return { isValid: isValid, errorMessage: errorMessage };
  };

  ReceiptEngine.prototype.extractForPdf = function () {
    var logText = this.logText;
    var extractedValues = {};
    var numZeros = new Array(this.config.numZeros || 14).fill(0);

    var valorDocumentoMatch = logText.match(/Valor (do documento|liquido a debitar)\s*:\s*R\$\s*([\d,.]+)/i);
    if (valorDocumentoMatch && valorDocumentoMatch[2]) {
      var valorDocumento = parseFloat(valorDocumentoMatch[2].replace(",", "."));
      extractedValues.valorDocumento = valorDocumento;
      extractedValues.valorDocumentoFormatado = valorDocumento.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    var codigoBarrasMatch = logText.match(/Codigo de Barras\s*:\s*(\d+)/i);
    if (codigoBarrasMatch && codigoBarrasMatch[1]) extractedValues.codigoBarras = codigoBarrasMatch[1];

    var nsuMatch = logText.match(/Nsu\s*:\s*(\d+)/i);
    if (nsuMatch && nsuMatch[1]) extractedValues.nsu = nsuMatch[1];

    var dataMovimentoMatch = logText.match(/Data do movimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
    if (dataMovimentoMatch) {
      extractedValues.diaPagamento = dataMovimentoMatch[1];
      extractedValues.mesPagamento = dataMovimentoMatch[2];
      extractedValues.anoPagamento = dataMovimentoMatch[3];
      extractedValues.dataPagamento = dataMovimentoMatch[1] + "/" + dataMovimentoMatch[2] + "/" + dataMovimentoMatch[3];
    }

    var dataVencimentoMatch = logText.match(/Data de vencimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
    if (dataVencimentoMatch) {
      extractedValues.diaVencimento = dataVencimentoMatch[1];
      extractedValues.mesVencimento = dataVencimentoMatch[2];
      extractedValues.anoVencimento = dataVencimentoMatch[3];
      extractedValues.dataVencimento = dataVencimentoMatch[1] + "/" + dataVencimentoMatch[2] + "/" + dataVencimentoMatch[3];
    }

    var agenciaRecebedoraMatch = logText.match(/Agencia recebedora\s*:\s*(\d+)/i);
    if (agenciaRecebedoraMatch) extractedValues.agenciaRecebedora = agenciaRecebedoraMatch[1];

    var horarioCanalMatch = logText.match(/Hora no Canal\s*:\s*(\d{2}:\d{2}:\d{2})/i);
    if (horarioCanalMatch) {
      extractedValues.horarioCanal = horarioCanalMatch[1].substr(0, 5);
      extractedValues.horarioCanalSemCaracteresEspeciais = horarioCanalMatch[1].substr(0, 5).replace(/:/g, "");
    }

    var nomeMatch = logText.match(/Nome do cliente\s*:\s*(.+)/i);
    if (nomeMatch && nomeMatch[1]) extractedValues.nome = nomeMatch[1];

    var agenciaMatch = logText.match(/Agencia\s*:\s*(\d+)\s*-\s*([^\n]+)/i);
    if (agenciaMatch) {
      extractedValues.agencia = agenciaMatch[1];
      extractedValues.agenciaDescricao = agenciaMatch[2].replace("_", " ");
    }

    var formaPagamentoMatch = logText.match(/Forma de (Pagamento|Recebimento)\s*:\s*(\d+)\s*-\s*([^\n]+)\b/i);
    if (formaPagamentoMatch) {
      extractedValues.formaPagamentoId = formaPagamentoMatch[2];
      extractedValues.formaPagamentoDescricao = formaPagamentoMatch[3];
    }

    var contaMatch = logText.match(/Conta para Debito\s*:\s*([^\n]+)\b/i);
    if (contaMatch) {
      extractedValues.conta = contaMatch[1];
      if (agenciaRecebedoraMatch) {
        extractedValues.agenciaConta = agenciaRecebedoraMatch[1] + "/" + contaMatch[1];
      }
    }

    var competenciaMatch = logText.match(/Data de competencia\s*:\s*(\d{2})(\d{4})/i);
    if (competenciaMatch) extractedValues.competencia = competenciaMatch[1] + "/" + competenciaMatch[2];

    var convenioMatch = logText.match(/Codigo do Convenio\s*:\s*(\d+)/i);
    if (convenioMatch) {
      var cv = convenioMatch[1];
      var validos = ["12173", "12157", "12190", "1221", "12513"];
      extractedValues.convenioId = cv;
      extractedValues.convenioFormatado =
        validos.indexOf(cv) >= 0
          ? "0180 - com centralização ou com tomador"
          : cv === "00116"
            ? "418 - FGTS / GFIP"
            : cv === "13617"
              ? "411 - FGTS / GFIP"
              : cv === "14010"
                ? "412 - FGTS / GFIP"
                : cv;
    }

    var jurosMultaMatch = logText.match(/Valor dos juros\/multa\s*:\s*R\$\s*([\d,\.]+)/i);
    extractedValues.valorJurosMulta = jurosMultaMatch ? jurosMultaMatch[1] : "0,00";

    var valorDescontoMatch = logText.match(/Valor do desconto\s*:\s*R\$\s*([\d,.]+)/i);
    extractedValues.valorDesconto = valorDescontoMatch ? valorDescontoMatch[1] : "0,00";

    extractedValues.valorEncargos = extractedValues.valorJurosMulta;

    var valorPagoMatch = logText.match(/Valor liquido a debitar\s*:\s*R\$\s*([\d,.]+)/i);
    if (valorPagoMatch && valorPagoMatch[1]) {
      var valorPago = parseFloat(valorPagoMatch[1].replace(",", "."));
      extractedValues.valorPago = valorPago;
      extractedValues.valorPagoFormatado = valorPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    } else if (extractedValues.valorDocumento) {
      extractedValues.valorPago = extractedValues.valorDocumento;
      extractedValues.valorPagoFormatado = extractedValues.valorDocumentoFormatado;
    }

    if (valorDocumentoMatch && valorDocumentoMatch[2]) {
      var valordocNSU = valorDocumentoMatch[2].replace(",", "").split("");
      var aux = numZeros.length;
      for (var index = valordocNSU.length; index >= 0; index--) {
        numZeros[aux] = valordocNSU[index];
        aux--;
      }
      numZeros.pop();
      extractedValues.Numbers_zeros = numZeros.join("");
    }

    if (
      extractedValues.agenciaRecebedora &&
      extractedValues.anoPagamento &&
      extractedValues.mesPagamento &&
      extractedValues.diaPagamento &&
      extractedValues.Numbers_zeros &&
      extractedValues.nsu
    ) {
      var authHorario =
        this.config.authIncludeHorario === false
          ? ""
          : extractedValues.horarioCanalSemCaracteresEspeciais || "";
      extractedValues.autenticacao =
        extractedValues.agenciaRecebedora +
        extractedValues.anoPagamento +
        extractedValues.mesPagamento +
        extractedValues.diaPagamento +
        authHorario +
        extractedValues.Numbers_zeros +
        extractedValues.nsu;
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var hours = String(today.getHours()).padStart(2, "0");
    var minutes = String(today.getMinutes()).padStart(2, "0");
    extractedValues.dataEmissao = dd + "/" + mm + "/" + yyyy + " " + hours + ":" + minutes;

    var extractors = this.config.customExtractors || {};
    Object.keys(extractors).forEach(function (key) {
      try {
        var val = extractors[key](logText);
        if (val !== undefined) extractedValues[key] = val;
      } catch (e) {
        console.error("Extrator PDF " + key + ":", e);
      }
    });

    return extractedValues;
  };

  ReceiptEngine.prototype.getLogoPath = function () {
    var url = this.options.logoUrl || "logomerc.png";
    if (/^data:/i.test(url) || /^https?:\/\//i.test(url)) return url;
    var link = document.createElement("a");
    link.href = url;
    return link.href;
  };

  ReceiptEngine.prototype.loadLogoAsDataUrl = function () {
    var src = this.getLogoPath();
    if (/^data:/i.test(src)) return Promise.resolve(src);

    return new Promise(function (resolve) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        try {
          var canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          canvas.getContext("2d").drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (err) {
          console.warn("Logo: usando URL direta", err);
          resolve(src);
        }
      };
      img.onerror = function () {
        console.warn("Logo não encontrada:", src);
        resolve(src);
      };
      img.src = src;
    });
  };

  ReceiptEngine.prototype.applyLogoUrl = function (html, logoSrc) {
    logoSrc = logoSrc || this.getLogoPath();
    var safe = String(logoSrc).replace(/"/g, "&quot;");
    return html.replace(/src="[^"]*logomerc\.png[^"]*"/gi, 'src="' + safe + '"');
  };

  ReceiptEngine.prototype.generatePDF = function () {
    var self = this;
    if (typeof html2pdf === "undefined") {
      return Promise.reject(new Error("html2pdf.js não carregado."));
    }

    return this.loadLogoAsDataUrl().then(function (logoDataUrl) {
      var extractedValues = self.extractForPdf();
      var htmlContent = self.applyLogoUrl(self.config.receiptTemplate, logoDataUrl);

      if (self.config.conditionalFields) {
        self.config.conditionalFields.forEach(function (field) {
          if (field.condition && typeof field.condition === "function") {
            var shouldInclude = field.condition(self.formValues, extractedValues);
            if (!shouldInclude) {
              var regex = new RegExp(
                field.removePattern ||
                  '<tr[^>]*>[^<]*<td[^>]*>[^<]*' + field.id + "[^<]*</td>.*?</tr>",
                "is",
              );
              htmlContent = htmlContent.replace(regex, "");
            }
          }
        });
      }

      var replacements = {
        codigoBarras: extractedValues.codigoBarras || "",
        valorDocumento: extractedValues.valorDocumentoFormatado || "",
        valorPago: extractedValues.valorPagoFormatado || "",
        dataMovimento: extractedValues.dataPagamento || "",
        dataVencimento: extractedValues.dataVencimento || "",
        vencimento: extractedValues.vencimento || extractedValues.dataVencimento || "",
        exercicio: extractedValues.exercicio || "",
        renavam: extractedValues.renavam || "",
        cotaParcela: extractedValues.cotaParcela || "",
        controleDARE: extractedValues.controleDARE || "",
        nsu: extractedValues.nsu || "",
        agenciaRecebedora: extractedValues.agenciaRecebedora || "",
        autenticacao: extractedValues.autenticacao ? "0389" + extractedValues.autenticacao : "",
        nomepagador: extractedValues.nome || "",
        numerotransação: extractedValues.nsu || "",
        DataEmissão: extractedValues.dataEmissao || "",
        competencia: extractedValues.competencia || "",
        jurosMulta: extractedValues.valorJurosMulta ? "R$ " + extractedValues.valorJurosMulta : "R$ 0,00",
        desconto: extractedValues.valorDesconto ? "R$ " + extractedValues.valorDesconto : "R$ 0,00",
        encargos: extractedValues.valorEncargos ? "R$ " + extractedValues.valorEncargos : "R$ 0,00",
        canalPagamento: extractedValues.agenciaDescricao || "",
        formaPagamento: extractedValues.formaPagamentoDescricao || "",
        agenciaconta: extractedValues.agenciaConta || "",
        convenio: self.formValues.convenio || extractedValues.convenioFormatado || "",
        municipio: self.formValues.municipio || "",
        cpfcnpj: extractedValues.cpfCnpj || "",
        docDae: extractedValues.docDae || "",
      };

      var modifiedHtmlContent = htmlContent;
      Object.keys(replacements).forEach(function (id) {
        var value = replacements[id];
        var tdRegex = new RegExp('<td[^>]*id="' + id + '"[^>]*></td>', "g");
        modifiedHtmlContent = modifiedHtmlContent.replace(
          tdRegex,
          '<td class="foco" id="' + id + '">' + value + "</td>",
        );
        var spanRegex = new RegExp('<span[^>]*id="' + id + '"[^>]*></span>', "g");
        modifiedHtmlContent = modifiedHtmlContent.replace(
          spanRegex,
          '<span id="' + id + '">' + value + "</span>",
        );
      });

      var tempElement = document.createElement("div");
      tempElement.innerHTML = modifiedHtmlContent;

      var fileNamePrefix = self.config.fileNamePrefix || "comprovante_";
      var fileName = fileNamePrefix + (extractedValues.nsu || "novo") + ".pdf";

      return html2pdf()
        .set({
          margin: self.config.pdfMargins || [10, 10, 10, 10],
          filename: fileName,
          html2canvas: { dpi: 600, scale: 4, useCORS: true },
          jsPDF: {
            unit: "mm",
            format: self.config.pdfFormat || "a4",
            orientation: self.config.pdfOrientation || "portrait",
          },
        })
        .from(tempElement)
        .save();
    });
  };

  ReceiptEngine.prototype.showModal = function (title, message, type) {
    var overlay = this.refs.modalOverlay;
    if (!overlay) return;
    overlay.hidden = false;
    this.refs.modalTitle.textContent = title;
    this.refs.modalTitle.className = "rg-modal-title rg-" + (type || "loading");
    this.refs.modalMessage.textContent = message;
    this.refs.modalSpinner.hidden = type !== "loading";
  };

  ReceiptEngine.prototype.hideModal = function () {
    if (this.refs.modalOverlay) this.refs.modalOverlay.hidden = true;
  };

  ReceiptEngine.prototype.onGenerateClick = function () {
    var self = this;
    var result = this.validateForm();
    if (!result.isValid) {
      this.showModal("Erro", result.errorMessage, "error");
      setTimeout(function () { self.hideModal(); }, 3000);
      return;
    }

    this.showModal("Gerando comprovante...", "Processando dados do LOG. Aguarde um momento.", "loading");

    this.generatePDF()
      .then(function () {
        self.showModal("Comprovante Gerado!", "O download do PDF foi iniciado.", "success");
        self.buttonSuccess = true;
        self.updateButton();
        setTimeout(function () {
          self.hideModal();
          setTimeout(function () {
            self.buttonSuccess = false;
            self.updateButton();
          }, 2000);
        }, 2000);
      })
      .catch(function (err) {
        console.error(err);
        self.showModal("Erro", "Não foi possível gerar o comprovante. Verifique os dados informados.", "error");
        setTimeout(function () { self.hideModal(); }, 3000);
      });
  };

  ReceiptEngine.prototype.renderPreview = function () {
    var box = this.refs.previewInfo;
    var status = this.refs.previewStatus;
    if (!box) return;

    if (!this.isDataExtracted) {
      if (status) {
        status.className = "rg-preview-badge rg-preview-badge--idle";
        status.textContent = "Aguardando LOG";
      }
      box.innerHTML =
        '<div class="rg-preview-empty">' +
        '<div class="rg-preview-empty-icon" aria-hidden="true">' + SVG.scan + "</div>" +
        "<p>Cole o LOG da transação</p>" +
        '<span class="rg-preview-empty-hint">Os dados serão extraídos automaticamente</span></div>';
      return;
    }

    var fields = this.config.extractFields || [];
    var self = this;
    var filled = 0;
    fields.forEach(function (field) {
      if (self.extractedData[field.id]) filled++;
    });

    if (status) {
      status.className = "rg-preview-badge rg-preview-badge--ok";
      status.textContent = filled + " de " + fields.length + " campos";
    }

    var html = '<dl class="rg-data-list">';
    fields.forEach(function (field) {
      var val = self.extractedData[field.id] || "—";
      var empty = !self.extractedData[field.id];
      html +=
        '<div class="rg-data-row' + (field.fullWidth ? " rg-data-row--full" : "") + (empty ? " rg-data-row--empty" : "") + '">' +
        "<dt>" + escapeHtml(field.label) + "</dt>" +
        "<dd>" + escapeHtml(val) + "</dd></div>";
    });
    html += "</dl>";
    box.innerHTML = html;
  };

  ReceiptEngine.prototype.updateButton = function () {
    var btn = this.refs.generateBtn;
    if (!btn) return;
    btn.disabled = this.isButtonDisabled;
    btn.classList.toggle("rg-btn-primary--disabled", this.isButtonDisabled);
    if (this.buttonSuccess) {
      btn.classList.add("rg-btn-primary--success");
      btn.innerHTML = SVG.check + "<span>Comprovante gerado</span>";
    } else {
      btn.classList.remove("rg-btn-primary--success");
      btn.innerHTML = SVG_EXTRA.download + "<span>Gerar comprovante PDF</span>";
    }
  };

  ReceiptEngine.prototype.renderFormFields = function () {
    var wrap = this.refs.formFields;
    if (!wrap) return;
    var self = this;
    wrap.innerHTML = "";

    (this.config.formFields || []).forEach(function (field) {
      var group = document.createElement("div");
      group.className = "rg-field";

      var label = document.createElement("label");
      label.className = "rg-label";
      label.htmlFor = "rg-field-" + field.id;
      label.textContent = field.label;
      group.appendChild(label);

      var input;
      if (field.type === "select") {
        var wrapper = document.createElement("div");
        wrapper.className = "rg-select-wrapper";
        input = document.createElement("select");
        input.className = "rg-select";
        input.id = "rg-field-" + field.id;
        (field.options || []).forEach(function (opt) {
          var o = document.createElement("option");
          o.value = opt.value;
          o.textContent = opt.label;
          input.appendChild(o);
        });
        input.value = self.formValues[field.id] || "";
        wrapper.appendChild(input);
        group.appendChild(wrapper);
      } else {
        input = document.createElement("input");
        input.type = field.type || "text";
        input.className = "rg-input";
        input.id = "rg-field-" + field.id;
        input.placeholder = field.placeholder || "";
        input.value = self.formValues[field.id] || "";
        group.appendChild(input);
      }

      input.addEventListener("change", function (e) {
        self.formValues[field.id] = e.target.value;
        self.previewExtractedInfo();
      });
      input.addEventListener("input", function (e) {
        self.formValues[field.id] = e.target.value;
        self.previewExtractedInfo();
      });

      self.refs[field.id] = input;
      wrap.appendChild(group);
    });
  };

  ReceiptEngine.prototype.renderInstructions = function () {
    var list = this.refs.instructionsList;
    if (!list) return;

    var items;
    if (this.config.instructions && this.config.instructions.length) {
      items = this.config.instructions;
    } else {
      items = ["Cole o LOG completo da transação no campo à esquerda"];
      if (this.config.formFields && this.config.formFields.length) {
        items.push("Preencha os campos adicionais obrigatórios");
      }
      items.push(
        "Confira os dados detectados no painel ao lado",
        'Clique em "Gerar comprovante PDF" para baixar',
      );
      if (this.isBarcodeRequired()) {
        items.push("O código de barras costuma ter 44 dígitos (ou 47 na linha digitável)");
      }
    }

    list.innerHTML = items
      .map(function (text, i) {
        return (
          '<li class="rg-step"><span class="rg-step-num">' +
          (i + 1) +
          '</span><span class="rg-step-text">' +
          escapeHtml(text) +
          "</span></li>"
        );
      })
      .join("");
  };

  ReceiptEngine.prototype.render = function () {
    var cfg = this.config;
    var self = this;
    var backHref = this.options.backHref;
    var backLabel = this.options.backLabel || "Voltar";
    var label = getDisplayLabel(this.tipo, cfg);
    var backHtml =
      backHref !== false && backHref != null
        ? '<a href="' + escapeHtml(backHref) + '" class="rg-back-link">' + SVG.arrowLeft + "<span>" + escapeHtml(backLabel) + "</span></a>"
        : "";

    this.container.innerHTML =
      '<div class="rg-page">' +
      '<main class="rg-page-main">' +
      (backHtml ? '<nav class="rg-page-nav">' + backHtml + "</nav>" : "") +
      '<header class="rg-page-header">' +
      '<span class="rg-page-badge">' + escapeHtml(label) + "</span>" +
      '<h1 class="rg-page-title">Gerar comprovante</h1>' +
      '<p class="rg-page-lead">' + escapeHtml(cfg.subtitle || "Cole o LOG e preencha os campos para gerar o PDF.") + "</p>" +
      "</header>" +
      '<div class="rg-page-layout">' +
      '<section class="rg-card rg-card-form" aria-labelledby="rg-form-heading">' +
      '<div class="rg-card-head">' +
      '<span class="rg-card-head-icon" aria-hidden="true">' + SVG_EXTRA.clipboard + "</span>" +
      '<div><h2 id="rg-form-heading" class="rg-card-title">Entrada de dados</h2>' +
      '<p class="rg-card-desc">Cole o LOG completo retornado pelo sistema</p></div></div>' +
      '<div class="rg-card-body">' +
      '<div class="rg-field"><label class="rg-label" for="rg-log">LOG da transação</label>' +
      '<textarea id="rg-log" class="rg-textarea rg-textarea--log" rows="12" placeholder="Cole o log completo da transação aqui…"></textarea></div>' +
      '<div id="rg-form-fields" class="rg-extra-fields"></div>' +
      "</div>" +
      '<div class="rg-card-footer">' +
      '<button type="button" id="rg-generate" class="rg-btn-primary rg-btn-primary--disabled" disabled>' +
      SVG_EXTRA.download + "<span>Gerar comprovante PDF</span></button></div></section>" +
      '<aside class="rg-page-aside">' +
      '<section class="rg-card rg-card-preview" aria-labelledby="rg-preview-heading">' +
      '<div class="rg-card-head rg-card-head--split">' +
      '<div class="rg-card-head-left">' +
      '<span class="rg-card-head-icon" aria-hidden="true">' + SVG.info + "</span>" +
      '<h2 id="rg-preview-heading" class="rg-card-title">Dados detectados</h2></div>' +
      '<span id="rg-preview-status" class="rg-preview-badge rg-preview-badge--idle">Aguardando LOG</span></div>' +
      '<div id="rg-preview-info" class="rg-card-body rg-card-body--preview"></div></section>' +
      '<section class="rg-card rg-card-steps" aria-labelledby="rg-steps-heading">' +
      '<div class="rg-card-head">' +
      '<span class="rg-card-head-icon" aria-hidden="true">' + SVG_EXTRA.list + "</span>" +
      '<h2 id="rg-steps-heading" class="rg-card-title">Como funciona</h2></div>' +
      '<ol id="rg-instructions" class="rg-steps"></ol></section></aside></div></main>' +
      '<div id="rg-modal" class="rg-modal-overlay" hidden role="dialog" aria-modal="true">' +
      '<div class="rg-modal"><div class="rg-modal-content">' +
      '<div id="rg-spinner" class="rg-spinner"></div>' +
      '<h3 id="rg-modal-title" class="rg-modal-title"></h3>' +
      '<p id="rg-modal-message" class="rg-modal-message"></p></div></div></div></div>';

    this.refs.logText = $("#rg-log", this.container);
    this.refs.formFields = $("#rg-form-fields", this.container);
    this.refs.previewInfo = $("#rg-preview-info", this.container);
    this.refs.previewStatus = $("#rg-preview-status", this.container);
    this.refs.instructionsList = $("#rg-instructions", this.container);
    this.refs.generateBtn = $("#rg-generate", this.container);
    this.refs.modalOverlay = $("#rg-modal", this.container);
    this.refs.modalTitle = $("#rg-modal-title", this.container);
    this.refs.modalMessage = $("#rg-modal-message", this.container);
    this.refs.modalSpinner = $("#rg-spinner", this.container);

    this.refs.logText.addEventListener("input", function (e) {
      self.logText = e.target.value;
      self.previewExtractedInfo();
    });

    this.refs.generateBtn.addEventListener("click", function () {
      self.onGenerateClick();
    });

    this.renderFormFields();
    this.renderInstructions();
    this.renderPreview();
    this.updateButton();
  };

  ReceiptEngine.prototype.init = function () {
    if (!this.container) throw new Error("Container não encontrado.");
    if (!this.config) throw new Error("Configuração de comprovante inválida.");
    this.render();
    return this;
  };

  global.ReceiptGenerator = {
    init: function (opts) {
      opts = opts || {};
      var tipo = opts.tipo;
      var config = mergeConfig(tipo, opts.config);
      if (!config) {
        throw new Error("Tipo de comprovante inválido: " + tipo);
      }
      var engine = new ReceiptEngine(opts.container, config, {
        tipo: tipo,
        logoUrl: opts.logoUrl,
        backHref: opts.backHref !== undefined ? opts.backHref : "index.html",
        backLabel: opts.backLabel,
      });
      return engine.init();
    },
    listTipos: function () {
      return global.RECEIPT_CONFIGS ? Object.keys(global.RECEIPT_CONFIGS) : [];
    },
    getConfig: function (tipo) {
      return mergeConfig(tipo);
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
