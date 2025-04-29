import React, { useState, useEffect, useRef } from "react";
import { FileText, Info, HelpCircle } from "lucide-react";
import styles from "/styles/ReceiptGenerator.module.css";

const CustomizableReceiptGenerator = ({ config }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  // Estados para controlar os dados do formulário
  const [logText, setLogText] = useState("");
  const [formValues, setFormValues] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const [isDataExtracted, setIsDataExtracted] = useState(false);
  const [status, setStatus] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "loading",
  });
  const [buttonState, setButtonState] = useState({
    text: "Gerar Comprovante",
    icon: "file-text",
    color: "bg-blue-600 hover:bg-blue-700",
  });

  const textAreaRef = useRef(null);
  const formRefs = useRef({});

  // Inicializa os valores do formulário com base na configuração
  useEffect(() => {
    const initialValues = {};
    if (config.formFields) {
      config.formFields.forEach((field) => {
        initialValues[field.id] = field.defaultValue || "";
      });
    }
    setFormValues(initialValues);
    setIsBrowser(true);
  }, [config]);

  // Efeito para verificar quando o texto muda
  useEffect(() => {
    if (logText.trim()) {
      previewExtractedInfo();
    } else {
      setIsDataExtracted(false);
    }
  }, [logText]);

  // Função para lidar com mudanças nos campos do formulário
  const handleFormChange = (fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Função para pré-visualizar informações extraídas
  const previewExtractedInfo = () => {
    const textContent = logText.trim();

    if (!textContent) {
      setIsDataExtracted(false);
      return;
    }

    try {
      // Objeto para armazenar os dados extraídos
      const newData = {};

      // Extrair dados comuns que aparecem na maioria dos LOGs
      const extractCommonData = () => {
        // Valor do documento
        const valorDocumentoMatch = textContent.match(
          /Valor (do documento|liquido a debitar)\s*:\s*R\$\s*([\d,.]+)/i,
        );
        if (valorDocumentoMatch && valorDocumentoMatch[2]) {
          const valorDocumento = parseFloat(
            valorDocumentoMatch[2].replace(",", "."),
          );
          const valorFormatado = valorDocumento.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          newData.valorDocumento = valorFormatado;
        }

        // Código de barras
        const codigoBarrasMatch = textContent.match(
          /Codigo de Barras\s*:\s*(\d{44})/i,
        );
        if (codigoBarrasMatch && codigoBarrasMatch[1]) {
          newData.codigoBarras = codigoBarrasMatch[1];
        }

        // NSU
        const nsuMatch = textContent.match(/Nsu\s*:\s*(\d+)/i);
        if (nsuMatch && nsuMatch[1]) {
          newData.nsu = nsuMatch[1];
        }

        // Data de pagamento
        const dataMovimentoMatch = textContent.match(
          /Data do movimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
        );
        if (dataMovimentoMatch) {
          const dataPagamento = `${dataMovimentoMatch[1]}/${dataMovimentoMatch[2]}/${dataMovimentoMatch[3]}`;
          newData.dataPagamento = dataPagamento;
        }

        // Data de vencimento
        const dataVencimentoMatch = textContent.match(
          /Data de vencimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
        );
        if (dataVencimentoMatch) {
          const dataVencimento = `${dataVencimentoMatch[1]}/${dataVencimentoMatch[2]}/${dataVencimentoMatch[3]}`;
          newData.dataVencimento = dataVencimento;
        }

        // Nome do cliente
        const nomeMatch = textContent.match(/Nome do cliente\s*:\s*(.+)/i);
        if (nomeMatch && nomeMatch[1]) {
          newData.nome = nomeMatch[1];
        }

        // Agência recebedora e conta
        const agenciaRecebedoraMatch = textContent.match(
          /Agencia recebedora\s*:\s*(\d+)/i,
        );
        const contaMatch = textContent.match(
          /Conta para Debito\s*:\s*([^\n]+)\b/i,
        );

        if (agenciaRecebedoraMatch && contaMatch) {
          newData.agenciaConta = `${agenciaRecebedoraMatch[1]}/${contaMatch[1]}`;
        }

        // Competência
        const competenciaMatch = textContent.match(
          /Data de competencia\s*:\s*(\d{2})(\d{4})/i,
        );
        if (competenciaMatch) {
          const mes = competenciaMatch[1];
          const ano = competenciaMatch[2];
          newData.competencia = `${mes}/${ano}`;
        }

        // Convênio
        const convenioMatch = textContent.match(
          /Codigo do Convenio\s*:\s*(\d+)/i,
        );
        if (convenioMatch) {
          const convenioValue = convenioMatch[1];
          let convenioFormatado = "";

          const conveniosValidos = ["12173", "12157", "12190", "1221", "12513"];

          if (conveniosValidos.includes(convenioValue)) {
            convenioFormatado = "0180 - com centralização ou com tomador";
          } else if (convenioValue === "00116") {
            convenioFormatado = "418 - FGTS / GFIP";
          } else if (convenioValue === "13617") {
            convenioFormatado = "411 - FGTS / GFIP";
          } else if (convenioValue === "14010") {
            convenioFormatado = "412 - FGTS / GFIP";
          } else {
            convenioFormatado = convenioValue;
          }

          newData.convenio = convenioFormatado;

          // Se houver um campo de convênio no formulário, preencha-o automaticamente
          if (formValues.hasOwnProperty("convenio") && !formValues.convenio) {
            handleFormChange("convenio", convenioFormatado);
          }
        }
      };

      // Extrair os dados comuns
      extractCommonData();

      // Executar extratores personalizados definidos na configuração
      if (config.customExtractors) {
        for (const [key, extractorFn] of Object.entries(
          config.customExtractors,
        )) {
          try {
            const extractedValue = extractorFn(textContent);
            if (extractedValue !== undefined) {
              newData[key] = extractedValue;
            }
          } catch (error) {
            console.error(
              `Erro ao executar extrator personalizado para ${key}:`,
              error,
            );
          }
        }
      }

      // Verificar se temos dados suficientes para mostrar a pré-visualização
      if (Object.keys(newData).length > 0) {
        setExtractedData(newData);
        setIsDataExtracted(true);
      } else {
        setIsDataExtracted(false);
      }
    } catch (error) {
      console.error("Erro ao extrair informações:", error);
      setIsDataExtracted(false);
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    let isValid = true;
    let errorMessage = "";

    // Validar o campo de LOG
    if (!logText.trim()) {
      textAreaRef.current.classList.add(styles.inputError);
      errorMessage =
        "Por favor, cole o LOG da transação para gerar o comprovante.";
      isValid = false;
    } else {
      textAreaRef.current.classList.remove(styles.inputError);

      // Validar se contém dados mínimos no LOG
      const valorMatch = logText.match(
        /Valor (do documento|liquido a debitar)\s*:\s*R\$\s*([\d,.]+)/i,
      );
      const codigoBarrasMatch = logText.match(
        /Codigo de Barras\s*:\s*(\d{44})/i,
      );
      const nsuMatch = logText.match(/Nsu\s*:\s*(\d+)/i);

      if (!valorMatch && !codigoBarrasMatch && !nsuMatch) {
        textAreaRef.current.classList.add(styles.inputError);
        errorMessage =
          "O LOG não contém informações suficientes. Verifique se o formato está correto.";
        isValid = false;
      }
    }

    // Validar campos adicionais do formulário
    if (config.formFields) {
      for (const field of config.formFields) {
        if (field.required && !formValues[field.id]) {
          if (formRefs.current[field.id]) {
            formRefs.current[field.id].classList.add(styles.inputError);
          }
          errorMessage =
            errorMessage || `Por favor, preencha o campo ${field.label}.`;
          isValid = false;
        } else if (formRefs.current[field.id]) {
          formRefs.current[field.id].classList.remove(styles.inputError);
        }
      }
    }

    return { isValid, errorMessage };
  };

  // Função para processar o LOG e gerar o PDF
  const processLogAndGeneratePDF = async () => {
    const { isValid, errorMessage } = validateForm();

    if (!isValid) {
      showStatusModal("Erro", errorMessage, "error");
      setTimeout(() => {
        hideStatusModal();
      }, 3000);
      return;
    }

    // Mostrar modal de carregamento
    showStatusModal(
      "Gerando comprovante...",
      "Processando dados do LOG. Aguarde um momento.",
      "loading",
    );

    try {
      // Chamada para função de geração do PDF
      await generatePDF();

      // Atualizar o modal para mostrar sucesso
      showStatusModal(
        "Comprovante Gerado!",
        "O download do PDF foi iniciado.",
        "success",
      );

      // Exibir feedback de sucesso no botão
      setButtonState({
        text: "Comprovante Gerado",
        icon: "check",
        color: "bg-green-600 hover:bg-green-700",
      });

      // Esconder o modal após alguns segundos
      setTimeout(() => {
        hideStatusModal();

        // Restaurar o botão após alguns segundos
        setTimeout(() => {
          setButtonState({
            text: "Gerar Comprovante",
            icon: "file-text",
            color: "bg-blue-600 hover:bg-blue-700",
          });
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      showStatusModal(
        "Erro",
        "Não foi possível gerar o comprovante. Verifique os dados informados.",
        "error",
      );

      // Esconder o modal após alguns segundos
      setTimeout(() => {
        hideStatusModal();
      }, 3000);
    }
  };

  // Função para mostrar o modal de status
  const showStatusModal = (title, message, type = "loading") => {
    setStatus({
      isVisible: true,
      title,
      message,
      type,
    });
  };

  // Função para esconder o modal de status
  const hideStatusModal = () => {
    setStatus((prev) => ({ ...prev, isVisible: false }));
  };

  // Função para gerar o PDF
  const generatePDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    // Definir a quantidade de zeros com base na configuração
    const Numbers_zeros = new Array(config.numZeros || 14).fill(0);

    // Extrair os dados do texto para uso no PDF
    const extractedValues = {};

    // Valor do documento
    const valorDocumentoMatch = logText.match(
      /Valor (do documento|liquido a debitar)\s*:\s*R\$\s*([\d,.]+)/i,
    );
    if (valorDocumentoMatch && valorDocumentoMatch[2]) {
      const valorDocumento = parseFloat(
        valorDocumentoMatch[2].replace(",", "."),
      );
      extractedValues.valorDocumento = valorDocumento;
      extractedValues.valorDocumentoFormatado = valorDocumento.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        },
      );
    }

    // Código de barras
    const codigoBarrasMatch = logText.match(/Codigo de Barras\s*:\s*(\d{44})/i);
    if (codigoBarrasMatch && codigoBarrasMatch[1]) {
      extractedValues.codigoBarras = codigoBarrasMatch[1];
    }

    // NSU
    const nsuMatch = logText.match(/Nsu\s*:\s*(\d+)/i);
    if (nsuMatch && nsuMatch[1]) {
      extractedValues.nsu = nsuMatch[1];
    }

    // Data do movimento
    const dataMovimentoMatch = logText.match(
      /Data do movimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
    );
    if (dataMovimentoMatch) {
      extractedValues.diaPagamento = dataMovimentoMatch[1];
      extractedValues.mesPagamento = dataMovimentoMatch[2];
      extractedValues.anoPagamento = dataMovimentoMatch[3];
      extractedValues.dataPagamento = `${dataMovimentoMatch[1]}/${dataMovimentoMatch[2]}/${dataMovimentoMatch[3]}`;
    }

    // Data de vencimento
    const dataVencimentoMatch = logText.match(
      /Data de vencimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
    );
    if (dataVencimentoMatch) {
      extractedValues.diaVencimento = dataVencimentoMatch[1];
      extractedValues.mesVencimento = dataVencimentoMatch[2];
      extractedValues.anoVencimento = dataVencimentoMatch[3];
      extractedValues.dataVencimento = `${dataVencimentoMatch[1]}/${dataVencimentoMatch[2]}/${dataVencimentoMatch[3]}`;
    }

    // Agência recebedora
    const agenciaRecebedoraMatch = logText.match(
      /Agencia recebedora\s*:\s*(\d+)/i,
    );
    if (agenciaRecebedoraMatch) {
      extractedValues.agenciaRecebedora = agenciaRecebedoraMatch[1];
    }

    // Hora no canal
    const horarioCanalMatch = logText.match(
      /Hora no Canal\s*:\s*(\d{2}:\d{2}:\d{2})/i,
    );
    if (horarioCanalMatch) {
      extractedValues.horarioCanal = horarioCanalMatch[1].substr(0, 5);
      extractedValues.horarioCanalSemCaracteresEspeciais = horarioCanalMatch[1]
        .substr(0, 5)
        .replace(/:/g, "");
    }

    // Nome do cliente
    const nomeMatch = logText.match(/Nome do cliente\s*:\s*(.+)/i);
    if (nomeMatch && nomeMatch[1]) {
      extractedValues.nome = nomeMatch[1];
    }

    // Agência e descrição
    const agenciaMatch = logText.match(/Agencia\s*:\s*(\d+)\s*-\s*([^\n]+)/i);
    if (agenciaMatch) {
      extractedValues.agencia = agenciaMatch[1];
      extractedValues.agenciaDescricao = agenciaMatch[2].replace("_", " ");
    }

    // Forma de pagamento
    const formaPagamentoMatch = logText.match(
      /Forma de (Pagamento|Recebimento)\s*:\s*(\d+)\s*-\s*([^\n]+)\b/i,
    );
    if (formaPagamentoMatch) {
      extractedValues.formaPagamentoId = formaPagamentoMatch[2];
      extractedValues.formaPagamentoDescricao = formaPagamentoMatch[3];
    }

    // Conta para débito
    const contaMatch = logText.match(/Conta para Debito\s*:\s*([^\n]+)\b/i);
    if (contaMatch) {
      extractedValues.conta = contaMatch[1];

      if (agenciaRecebedoraMatch) {
        extractedValues.agenciaConta = `${agenciaRecebedoraMatch[1]}/${contaMatch[1]}`;
      }
    }

    // Competência
    const competenciaMatch = logText.match(
      /Data de competencia\s*:\s*(\d{2})(\d{4})/i,
    );
    if (competenciaMatch) {
      extractedValues.competencia = `${competenciaMatch[1]}/${competenciaMatch[2]}`;
    }

    // Convênio
    const convenioMatch = logText.match(/Codigo do Convenio\s*:\s*(\d+)/i);
    if (convenioMatch) {
      extractedValues.convenioId = convenioMatch[1];

      const conveniosValidos = ["12173", "12157", "12190", "1221", "12513"];
      if (conveniosValidos.includes(convenioMatch[1])) {
        extractedValues.convenioFormatado =
          "0180 - com centralização ou com tomador";
      } else if (convenioMatch[1] === "00116") {
        extractedValues.convenioFormatado = "418 - FGTS / GFIP";
      } else if (convenioMatch[1] === "13617") {
        extractedValues.convenioFormatado = "411 - FGTS / GFIP";
      } else if (convenioMatch[1] === "14010") {
        extractedValues.convenioFormatado = "412 - FGTS / GFIP";
      } else {
        extractedValues.convenioFormatado = convenioMatch[1];
      }
    }

    // Juros/Multa
    const jurosMultaMatch = logText.match(
      /Valor dos juros\/multa\s*:\s*R\$\s*([\d,\.]+)/i,
    );
    if (jurosMultaMatch) {
      extractedValues.valorJurosMulta = jurosMultaMatch[1];
    } else {
      extractedValues.valorJurosMulta = "0,00";
    }

    // Desconto
    const valorDescontoMatch = logText.match(
      /Valor do desconto\s*:\s*R\$\s*([\d,.]+)/i,
    );
    if (valorDescontoMatch) {
      extractedValues.valorDesconto = valorDescontoMatch[1];
    } else {
      extractedValues.valorDesconto = "0,00";
    }

    // Encargos
    const valorEncargosMatch = logText.match(
      /Valor dos juros\/multa\s*:\s*R\$\s*([\d,.]+)/i,
    );
    if (valorEncargosMatch) {
      extractedValues.valorEncargos = valorEncargosMatch[1];
    } else {
      extractedValues.valorEncargos = "0,00";
    }

    // Valor pago (igual ao valor do documento se não for especificado)
    const valorPagoMatch = logText.match(
      /Valor liquido a debitar\s*:\s*R\$\s*([\d,.]+)/i,
    );
    if (valorPagoMatch && valorPagoMatch[1]) {
      const valorPago = parseFloat(valorPagoMatch[1].replace(",", "."));
      extractedValues.valorPago = valorPago;
      extractedValues.valorPagoFormatado = valorPago.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    } else if (extractedValues.valorDocumento) {
      extractedValues.valorPago = extractedValues.valorDocumento;
      extractedValues.valorPagoFormatado =
        extractedValues.valorDocumentoFormatado;
    }

    // Processar os zeros para autenticação
    if (valorDocumentoMatch && valorDocumentoMatch[2]) {
      const valordocNSU = valorDocumentoMatch[2].replace(",", "").split("");
      var aux = Numbers_zeros.length;
      for (let index = valordocNSU.length; index >= 0; index--) {
        Numbers_zeros[aux] = valordocNSU[index];
        aux--;
      }
      Numbers_zeros.pop();
      extractedValues.Numbers_zeros = Numbers_zeros.join("");
    }

    // Calcular autenticação
    if (
      extractedValues.agenciaRecebedora &&
      extractedValues.anoPagamento &&
      extractedValues.mesPagamento &&
      extractedValues.diaPagamento &&
      extractedValues.Numbers_zeros &&
      extractedValues.nsu
    ) {
      extractedValues.autenticacao = `${extractedValues.agenciaRecebedora}${extractedValues.anoPagamento}${extractedValues.mesPagamento}${extractedValues.diaPagamento}${extractedValues.horarioCanalSemCaracteresEspeciais || ""}${extractedValues.Numbers_zeros}${extractedValues.nsu}`;
    }

    // Obter a data e hora atual para a data de emissão
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");

    extractedValues.dataEmissao = `${dd}/${mm}/${yyyy} ${hours}:${minutes}`;

    // Usando o template HTML para o comprovante
    let htmlContent = config.receiptTemplate;

    // Tratar campos condicionais
    if (config.conditionalFields) {
      for (const field of config.conditionalFields) {
        if (field.condition && typeof field.condition === "function") {
          const shouldInclude = field.condition(formValues, extractedValues);

          if (!shouldInclude) {
            // Remover a linha/elemento correspondente ao campo
            const regex = new RegExp(
              field.removePattern ||
                `<tr[^>]*>[^<]*<td[^>]*>[^<]*${field.id}[^<]*</td>.*?</tr>`,
              "is",
            );
            htmlContent = htmlContent.replace(regex, "");
          }
        }
      }
    }

    // Preencher todos os campos no template HTML
    let modifiedHtmlContent = htmlContent;

    // Substitui os valores no HTML usando os valores extraídos
    const replacements = {
      // Campos básicos
      codigoBarras: extractedValues.codigoBarras || "",
      valorDocumento: extractedValues.valorDocumentoFormatado || "",
      valorPago: extractedValues.valorPagoFormatado || "",
      dataMovimento: extractedValues.dataPagamento || "",
      dataVencimento: extractedValues.dataVencimento || "",
      nsu: extractedValues.nsu || "",
      agenciaRecebedora: extractedValues.agenciaRecebedora || "",
      autenticacao: extractedValues.autenticacao
        ? `0389${extractedValues.autenticacao}`
        : "",
      nomepagador: extractedValues.nome || "",
      numerotransação: extractedValues.nsu || "",
      DataEmissão: extractedValues.dataEmissao || "",

      // Campos adicionais
      competencia: extractedValues.competencia || "",
      jurosMulta: extractedValues.valorJurosMulta
        ? `R$ ${extractedValues.valorJurosMulta}`
        : "R$ 0,00",
      desconto: extractedValues.valorDesconto
        ? `R$ ${extractedValues.valorDesconto}`
        : "R$ 0,00",
      encargos: extractedValues.valorEncargos
        ? `R$ ${extractedValues.valorEncargos}`
        : "R$ 0,00",
      canalPagamento: extractedValues.agenciaDescricao || "",
      formaPagamento: extractedValues.formaPagamentoDescricao || "",
      agenciaconta: extractedValues.agenciaConta || "",

      // Valores dos campos do formulário
      convenio: formValues.convenio || extractedValues.convenioFormatado || "",
    };

    // Aplicar todas as substituições
    for (const [id, value] of Object.entries(replacements)) {
      const regex = new RegExp(`<td[^>]*id="${id}"[^>]*></td>`, "g");
      modifiedHtmlContent = modifiedHtmlContent.replace(
        regex,
        `<td class="foco" id="${id}">${value}</td>`,
      );

      // Substituir também em spans (para o número da transação)
      const spanRegex = new RegExp(`<span[^>]*id="${id}"[^>]*></span>`, "g");
      modifiedHtmlContent = modifiedHtmlContent.replace(
        spanRegex,
        `<span id="${id}">${value}</span>`,
      );
    }

    // Criar um elemento temporário para armazenar a tabela
    const tempElement = document.createElement("div");
    tempElement.innerHTML = modifiedHtmlContent;

    // Construir o nome do arquivo
    const fileNamePrefix = config.fileNamePrefix || "comprovante_";
    const fileName = `${fileNamePrefix}${extractedValues.nsu || "novo"}.pdf`;

    // Converter a tabela HTML em PDF usando a biblioteca html2pdf
    return html2pdf(tempElement, {
      margin: config.pdfMargins || [10, 10, 10, 10],
      filename: fileName,
      html2canvas: { dpi: 600, scale: 4 },
      jsPDF: {
        unit: "mm",
        format: config.pdfFormat || "a4",
        orientation: config.pdfOrientation || "portrait",
      },
    });
  };

  // Renderizar campo de formulário com base no tipo
  const renderFormField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <div key={field.id} className={styles.formGroup}>
            <label htmlFor={field.id} className={styles.label}>
              {field.label}
            </label>
            <select
              id={field.id}
              ref={(el) => (formRefs.current[field.id] = el)}
              className={styles.select}
              value={formValues[field.id] || ""}
              onChange={(e) => handleFormChange(field.id, e.target.value)}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div key={field.id} className={styles.formGroup}>
            <label htmlFor={field.id} className={styles.label}>
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type || "text"}
              ref={(el) => (formRefs.current[field.id] = el)}
              className={styles.input}
              placeholder={field.placeholder || ""}
              value={formValues[field.id] || ""}
              onChange={(e) => handleFormChange(field.id, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{config.title || "Gerar Comprovante"}</h1>
        <p className={styles.subtitle}>
          {config.subtitle ||
            "Preencha os campos abaixo para gerar o comprovante de pagamento."}
        </p>
      </div>

      <div className={styles.content}>
        {/* Coluna de entrada de dados */}
        <div className={styles.inputColumn}>
          <div className={styles.formGroup}>
            <label htmlFor="textInput" className={styles.label}>
              LOG da Transação
            </label>
            <textarea
              ref={textAreaRef}
              id="textInput"
              rows="10"
              className={styles.textarea}
              placeholder="Cole o log completo da transação aqui"
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
            ></textarea>
          </div>

          {/* Campos de formulário adicionais configuráveis */}
          {config.formFields && config.formFields.map(renderFormField)}

          <div className={styles.buttonContainer}>
            <button
              onClick={processLogAndGeneratePDF}
              className={`${styles.button} ${buttonState.color}`}
            >
              {buttonState.icon === "file-text" ? (
                <FileText className={styles.buttonIcon} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.buttonIcon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              <span>{buttonState.text}</span>
            </button>
          </div>
        </div>

        {/* Coluna de preview/instruções */}
        <div className={styles.previewColumn}>
          <div className={styles.previewContainer}>
            <h3 className={styles.previewHeader}>
              <Info className={styles.infoIcon} />
              Dados Detectados
            </h3>

            <div className={styles.previewInfo}>
              {!isDataExtracted ? (
                <p className={styles.noDataMessage}>
                  Nenhum dado detectado. Cole o LOG da transação para visualizar
                  as informações.
                </p>
              ) : (
                <div className={styles.extractedInfo}>
                  <div className={styles.infoGrid}>
                    {config.extractFields &&
                      config.extractFields.map((field) => (
                        <div
                          key={field.id}
                          className={
                            field.fullWidth
                              ? styles.infoItemFull
                              : styles.infoItem
                          }
                        >
                          <span className={styles.infoLabel}>
                            {field.label}:
                          </span>
                          <span className={styles.infoValue}>
                            {extractedData[field.id] || ""}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.instructionsContainer}>
            <h4 className={styles.instructionsHeader}>
              <HelpCircle className={styles.helpIcon} />
              Instruções
            </h4>
            <ul className={styles.instructionsList}>
              {config.instructions ? (
                config.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))
              ) : (
                <>
                  <li>Cole o LOG completo da transação no campo à esquerda</li>
                  {config.formFields && config.formFields.length > 0 && (
                    <li>Preencha os campos adicionais necessários</li>
                  )}
                  <li>Verifique se os dados foram detectados corretamente</li>
                  <li>Clique em "Gerar Comprovante" para baixar o PDF</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Status/Loading */}
      {status.isVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              {status.type === "loading" && (
                <div className={styles.spinner}></div>
              )}
              <h3 className={`${styles.modalTitle} ${styles[status.type]}`}>
                {status.title}
              </h3>
              <p className={styles.modalMessage}>{status.message}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomizableReceiptGenerator;
