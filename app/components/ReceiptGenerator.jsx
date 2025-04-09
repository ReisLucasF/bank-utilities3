import React, { useState, useEffect, useRef } from "react";
import { FileText, Info, HelpCircle } from "lucide-react";
import styles from "/styles/ReceiptGenerator.module.css";

const ReceiptGenerator = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  // Estados para controlar os dados do formulário
  const [logText, setLogText] = useState("");
  const [convenio, setConvenio] = useState("");
  const [extractedData, setExtractedData] = useState({
    nsu: "",
    valorDocumento: "",
    valorPago: "",
    dataVencimento: "",
    dataPagamento: "",
    codigoBarras: "",
    nome: "",
    cpfCnpj: "",
  });
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
  const convenioRef = useRef(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Efeito para verificar quando o texto muda
  useEffect(() => {
    if (logText.trim()) {
      previewExtractedInfo();
    } else {
      setIsDataExtracted(false);
    }
  }, [logText]);

  // Função para pré-visualizar informações extraídas
  const previewExtractedInfo = () => {
    const textContent = logText.trim();

    if (!textContent) {
      setIsDataExtracted(false);
      return;
    }

    try {
      // Extrair os dados para pré-visualização
      const valorDocumentoMatch = textContent.match(
        /Valor do documento\s*:\s*R\$\s*([\d,.]+)/i,
      );
      const valorPagoMatch = textContent.match(
        /Valor liquido a debitar\s*:\s*R\$\s*([\d,.]+)/i,
      );
      const codigoBarrasMatch = textContent.match(
        /Codigo de Barras\s*:\s*(\d{44})/i,
      );
      const dataMovimentoMatch = textContent.match(
        /Data do movimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
      );
      const dataVencimentoMatch = textContent.match(
        /Data de vencimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
      );
      const nsuMatch = textContent.match(/Nsu\s*:\s*(\d+)/i);
      const nomeMatch = textContent.match(/Nome do cliente\s*:\s*(.+)/i);
      const cpfcnpjMatch = textContent.match(
        /CPF\/CNPJ do sacado\s*:\s*(\d+)/i,
      );

      // Verificar se temos dados suficientes para mostrar a pré-visualização
      if (valorDocumentoMatch || codigoBarrasMatch || nsuMatch) {
        const newData = { ...extractedData };

        // Formatar valores para exibição
        if (valorDocumentoMatch && valorDocumentoMatch[1]) {
          const valorDocumento = parseFloat(
            valorDocumentoMatch[1].replace(",", "."),
          );
          const valorFormatado = valorDocumento.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          newData.valorDocumento = valorFormatado;
        }

        if (valorPagoMatch && valorPagoMatch[1]) {
          const valorPago = parseFloat(valorPagoMatch[1].replace(",", "."));
          const valorPagoFormatado = valorPago.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          newData.valorPago = valorPagoFormatado;
        }

        if (codigoBarrasMatch && codigoBarrasMatch[1]) {
          newData.codigoBarras = codigoBarrasMatch[1];
        }

        if (nsuMatch && nsuMatch[1]) {
          newData.nsu = nsuMatch[1];
        }

        if (dataMovimentoMatch) {
          const dataPagamento = `${dataMovimentoMatch[1]}/${dataMovimentoMatch[2]}/${dataMovimentoMatch[3]}`;
          newData.dataPagamento = dataPagamento;
        }

        if (dataVencimentoMatch) {
          const dataVencimento = `${dataVencimentoMatch[1]}/${dataVencimentoMatch[2]}/${dataVencimentoMatch[3]}`;
          newData.dataVencimento = dataVencimento;
        }

        if (nomeMatch && nomeMatch[1]) {
          newData.nome = nomeMatch[1];
        }

        if (cpfcnpjMatch && cpfcnpjMatch[1]) {
          const numero = cpfcnpjMatch[1];
          let numeroFormatado = "";

          if (/^\d{14}$/.test(numero) && /^[1-9]/.test(numero.substr(0, 3))) {
            // Se o número tem exatamente 14 dígitos e os três primeiros não são zero, é CNPJ
            numeroFormatado = numero.replace(
              /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
              "$1.$2.$3/$4-$5",
            );
          } else {
            // Do contrário CPF
            numeroFormatado = numero
              .substr(3)
              .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
          }

          newData.cpfCnpj = numeroFormatado;
        }

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

    if (!logText.trim()) {
      textAreaRef.current.classList.add(styles.inputError);
      errorMessage =
        "Por favor, cole o LOG da transação para gerar o comprovante.";
      isValid = false;
    } else {
      textAreaRef.current.classList.remove(styles.inputError);

      // Validar se contém dados mínimos no LOG
      const valorMatch = logText.match(
        /Valor do documento\s*:\s*R\$\s*([\d,.]+)/i,
      );
      const codigoBarrasMatch = logText.match(
        /Codigo de Barras\s*:\s*(\d{44})/i,
      );

      if (!valorMatch && !codigoBarrasMatch) {
        textAreaRef.current.classList.add(styles.inputError);
        errorMessage =
          "O LOG não contém informações suficientes. Verifique se o formato está correto.";
        isValid = false;
      }
    }

    if (!convenio.trim()) {
      convenioRef.current.classList.add(styles.inputError);
      errorMessage = errorMessage || "Por favor, informe o nome do convênio.";
      isValid = false;
    } else {
      convenioRef.current.classList.remove(styles.inputError);
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
    const Numbers_zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Extrair os dados do texto
    const valorDocumentoMatch = logText.match(
      /Valor do documento\s*:\s*R\$\s*([\d,.]+)/i,
    );
    const valorPagoMatch = logText.match(
      /Valor liquido a debitar\s*:\s*R\$\s*([\d,.]+)/i,
    );
    const valorDescontoMatch = logText.match(
      /Valor do desconto\s*:\s*R\$\s*([\d,.]+)/i,
    );
    const valorEncargosMatch = logText.match(
      /Valor dos juros\/multa\s*:\s*R\$\s*([\d,.]+)/i,
    );
    const codigoBarrasMatch = logText.match(/Codigo de Barras\s*:\s*(\d{44})/i);
    const dataMovimentoMatch = logText.match(
      /Data do movimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
    );
    const nsuMatch = logText.match(/Nsu\s*:\s*(\d+)/i);

    const agenciaRecebedoraMatch = logText.match(
      /Agencia recebedora\s*:\s*(\d+)/i,
    );
    const horarioCanalMatch = logText.match(
      /Hora no Canal\s*:\s*(\d{2}:\d{2}:\d{2})/i,
    );
    const dataVencimentoMatch = logText.match(
      /Data de vencimento\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i,
    );
    const nomeMatch = logText.match(/Nome do cliente\s*:\s*(.+)/i);
    const agenciaMatch = logText.match(/Agencia\s*:\s*(\d+)\s*-\s*([^\n]+)/i);
    const formaPagamentoMatch = logText.match(
      /Forma de Recebimento\s*:\s*(\d+)\s*-\s*([^\n]+)\b/i,
    );

    if (!valorDocumentoMatch || !nsuMatch) {
      throw new Error(
        "Dados incompletos no LOG. Verifique se todas as informações necessárias estão presentes.",
      );
    }

    const agenciaDescricao = agenciaMatch ? agenciaMatch[2] : "N/A";
    const formaPagamentoDescricao = formaPagamentoMatch
      ? formaPagamentoMatch[2]
      : "N/A";

    const valorDocumento =
      valorDocumentoMatch && valorDocumentoMatch[1]
        ? parseFloat(valorDocumentoMatch[1].replace(",", "."))
        : 0;
    const valorPago =
      valorPagoMatch && valorPagoMatch[1]
        ? parseFloat(valorPagoMatch[1].replace(",", "."))
        : 0;
    const valorDocumentoFormatado = valorDocumento.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const valorPagoFormatado = valorPago.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const codigoBarras = codigoBarrasMatch ? codigoBarrasMatch[1] : "";

    const diaPagamento = dataMovimentoMatch ? dataMovimentoMatch[1] : "";
    const mesPagamento = dataMovimentoMatch ? dataMovimentoMatch[2] : "";
    const anoPagamento = dataMovimentoMatch
      ? dataMovimentoMatch[3].slice(-4)
      : "";
    const nsu = nsuMatch ? nsuMatch[1].substr(-6) : "";
    const agenciaRecebedora = agenciaRecebedoraMatch
      ? agenciaRecebedoraMatch[1]
      : "";
    const horarioCanal = horarioCanalMatch
      ? horarioCanalMatch[1].substr(0, 5)
      : "";

    const diaVencimento = dataVencimentoMatch ? dataVencimentoMatch[1] : "";
    const mesVencimento = dataVencimentoMatch ? dataVencimentoMatch[2] : "";
    const anoVencimento = dataVencimentoMatch ? dataVencimentoMatch[3] : "";

    const dataVencimento = `${diaVencimento}/${mesVencimento}/${anoVencimento}`;

    const convenioMatch = logText.match(/Codigo do Convenio\s*:\s*(\d+)/i);
    const convenioValue = convenioMatch ? convenioMatch[1] : "";

    let convenioformatado = "";

    const conveniosValidos = ["12173", "12157", "12190", "1221", "12513"];

    if (conveniosValidos.includes(convenioValue)) {
      convenioformatado = "0180 - com centralização ou com tomador";
    } else if (convenioValue === "00116") {
      convenioformatado = "418 - FGTS / GFIP";
    } else if (convenioValue === "13617") {
      convenioformatado = "411 - FGTS / GFIP";
    } else if (convenioValue === "14010") {
      convenioformatado = "412 - FGTS / GFIP";
    } else {
      convenioformatado = convenioValue;
    }

    let dataCompetenciaFormatada = "";

    const competenciaMatch = logText.match(
      /Data de competencia\s*:\s*(\d{2})(\d{4})/i,
    );
    if (competenciaMatch) {
      const mes = competenciaMatch[1];
      const ano = competenciaMatch[2];
      dataCompetenciaFormatada = `${mes}/${ano}`;
    }

    let valorJurosMulta = "0,00";
    const jurosMultaMatch = logText.match(
      /Valor dos juros\/multa\s*:\s*R\$\s*([\d,\.]+)/i,
    );
    if (jurosMultaMatch) {
      valorJurosMulta = jurosMultaMatch[1];
    }

    // Processar CPF/CNPJ
    const cpfcnpjMatch = logText.match(/CPF\/CNPJ do sacado\s*:\s*(\d+)/i);
    let numeroFormatado = "";

    if (cpfcnpjMatch && cpfcnpjMatch[1]) {
      const numero = cpfcnpjMatch[1];

      if (/^\d{14}$/.test(numero) && /^[1-9]/.test(numero.substr(0, 3))) {
        // Se o número tem exatamente 14 dígitos e os três primeiros não são zero, é CNPJ
        numeroFormatado = numero.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          "$1.$2.$3/$4-$5",
        );
      } else {
        // Do contrário CPF
        numeroFormatado = numero
          .substr(3)
          .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      }
    }

    //Realiza os 0 amais do valor na autenticação
    const valordocNSU = valorDocumentoMatch[1].replace(",", "").split("");
    var aux = Numbers_zeros.length;
    for (let index = valordocNSU.length; index >= 0; index--) {
      Numbers_zeros[aux] = valordocNSU[index];
      aux--;
    }
    Numbers_zeros.pop();

    // Remover caracteres especiais (":") do horário
    const horarioCanalSemCaracteresEspeciais = horarioCanal.replace(/:/g, "");

    // Calculando a autenticação conforme a fórmula fornecida
    const autenticacao = `${agenciaRecebedora}${anoPagamento}${mesPagamento}${diaPagamento}${horarioCanalSemCaracteresEspeciais}${Numbers_zeros.join("")}${nsuMatch[1]}`;

    // Obter a data e hora atual no formato DD/MM/AAAA HH:mm
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
    const yyyy = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const dataEmissao = `${dd}/${mm}/${yyyy} ${hours}:${minutes}`;

    // Usando o template HTML incorporado para o comprovante
    const htmlContent = getReceiptTemplate();

    // Preencher os dados na tabela no HTML
    const modifiedHtmlContent = htmlContent
      .replace(
        '<td id="codigoBarras"></td>',
        `<td class="foco" id="codigoBarras">${codigoBarras}</td>`,
      )
      .replace(
        '<td id="competencia"></td>',
        `<td class="foco" id="competencia">${dataCompetenciaFormatada}</td>`,
      )
      .replace(
        '<td id="valorDocumento"></td>',
        `<td class="foco" id="valorDocumento">${valorDocumentoFormatado}</td>`,
      )
      .replace(
        '<td id="jurosMulta"></td>',
        `<td class="foco" id="jurosMulta">R$ ${valorJurosMulta}</td>`,
      )
      .replace(
        '<td id="valorPago"></td>',
        `<td class="foco" id="valorPago">${valorPagoFormatado}</td>`,
      )
      .replace(
        '<td id="desconto"></td>',
        `<td class="foco" id="desconto">R$ ${valorDescontoMatch ? valorDescontoMatch[1] : "0,00"}</td>`,
      )
      .replace(
        '<td id="encargos"></td>',
        `<td class="foco" id="encargos">R$ ${valorEncargosMatch ? valorEncargosMatch[1] : "0,00"}</td>`,
      )
      .replace(
        '<td id="canalPagamento"></td>',
        `<td class="foco" id="canalPagamento">${agenciaDescricao.replace("_", " ")}</td>`,
      )
      .replace(
        '<td id="formaPagamento"></td>',
        `<td class="foco" id="formaPagamento">${formaPagamentoDescricao}</td>`,
      )
      .replace(
        '<td id="dataVencimento"></td>',
        `<td class="foco" id="dataVencimento">${dataVencimento}</td>`,
      )
      .replace(
        '<td id="dataMovimento"></td>',
        `<td class="foco" id="dataMovimento">${diaPagamento}/${mesPagamento}/${anoPagamento}</td>`,
      )
      .replace(
        '<td id="convenio"></td>',
        `<td class="foco" id="convenio">${convenio || convenioformatado}</td>`,
      )
      .replace(
        '<td id="nsu"></td>',
        `<td class="foco" id="nsu">${nsuMatch[1]}</td>`,
      )
      .replace(
        '<td id="cpfcnpj"></td>',
        `<td class="foco" id="cpfcnpj">${numeroFormatado}</td>`,
      )
      .replace(
        '<td id="nomepagador"></td>',
        `<td class="foco" id="nomepagador">${nomeMatch ? nomeMatch[1] : ""}</td>`,
      )
      .replace(
        '<td id="agenciaRecebedora"></td>',
        `<td class="foco" id="agenciaRecebedora">${agenciaRecebedora}</td>`,
      )
      .replace(
        '<td id="autenticacao"></td>',
        `<td class="foco" id="autenticacao">0389${autenticacao}</td>`,
      )
      .replace(
        '<span id="numerotransação"></span>',
        `<span id="numerotransação">${nsuMatch[1]}</span>`,
      )
      .replace(
        '<td id="DataEmissão"></td>',
        `<td class="foco" id="DataEmissão">${dataEmissao}</td>`,
      );

    // Criar um elemento temporário para armazenar a tabela
    const tempElement = document.createElement("div");
    tempElement.innerHTML = modifiedHtmlContent;

    // Converter a tabela HTML em PDF usando a biblioteca html2pdf
    return html2pdf(tempElement, {
      margin: [10, 10, 10, 10],
      filename: "comprovante_ficha_" + nsuMatch[1] + ".pdf",
      html2canvas: { dpi: 600, scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  };

  // Função para obter o template HTML do comprovante
  const getReceiptTemplate = () => `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Comprovante</title>
        <style>
          * {
            font-family: "Roboto", sans-serif;
            color: #000000 !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 60px;
            page-break-inside: auto;
          }
          th, td {
            padding: 5px;
            text-align: left;
            font-size: 12px;
            color: #000000 !important;
          }
          .col1 {
            width: 30%;
          }
          .col2 {
            text-align: center;
            font-size: 25px;
            font-weight: 100;
            color: #325797;
          }
          .footer1, .footer2, .footer3 {
            text-align: center;
            margin: 0.5px;
          }
          .footer1 {
            font-weight: 600;
          }
          .logo {
            margin: 15px 0;
          }
          .mb {
            border-bottom: 1px solid rgba(0, 0, 0, 0.164);
          }
          .foco {
            font-weight: 700;
            color: #000000 !important;
          }
          h4 {
            font-size: 19px;
            color: #000000 !important;
          }
        </style>
      </head>
      <body>
        <table id="comprovanteTable">
          <tr>
            <th class="col2" colspan="2">
              <div class="logo">BANCO</div><br />
              Remissão de Pagamento Ficha Compensação
            </th>
          </tr>
          <tr>
            <td><br /></td>
            <td></td>
          </tr>
          <tr></tr>
          <tr class="mb">
            <td>Data de Emissão</td>
            <td id="DataEmissão"></td>
          </tr>
          <tr class="mb">
            <td>Canal de Pagamento</td>
            <td id="canalPagamento"></td>
          </tr>
          <tr class="mb">
            <td>Forma de pagamento</td>
            <td id="formaPagamento"></td>
          </tr>
          <br />

          <tr>
            <td><br /></td>
            <td></td>
          </tr>

          <tr class="mb">
            <td>Pagador</td>
          </tr>
          <tr class="mb">
            <td>Nome:</td>
            <td id="nomepagador"></td>
          </tr>
          <tr class="mb">
            <td>CPF/CPJ:</td>
            <td id="cpfcnpj"></td>
          </tr>

          <tr>
            <td><br /></td>
            <td></td>
          </tr>
          <tr class="mb">
            <td>Data do Pagamento</td>
            <td id="dataMovimento"></td>
          </tr>
          <tr class="mb">
            <td>Data do Vencimento</td>
            <td id="dataVencimento"></td>
          </tr>
          <tr class="mb">
            <td>Valor Nominal</td>
            <td id="valorDocumento"></td>
          </tr>
          <tr class="mb">
            <td>Encargos</td>
            <td id="encargos"></td>
          </tr>
          <tr class="mb">
            <td>Desconto</td>
            <td id="desconto"></td>
          </tr>
          <tr class="mb">
            <td>Valor Pago</td>
            <td id="valorPago"></td>
          </tr>
          <tr class="mb">
            <td>Código de Barras</td>
            <td id="codigoBarras"></td>
          </tr>
          <tr class="mb">
            <td><br /></td>
            <td></td>
          </tr>
          <tr class="mb">
            <td>Autenticação</td>
            <td id="autenticacao"></td>
          </tr>

          <tr>
            <td colspan="2">
              <p class="footer1">
                Em caso de digitação incorreta de dados que ocasione pagamento de
                valor inferior ao devido, autorizo o débito dessa diferença em minha
                conta-corrente. Se o Banco beneficiário deste pagamento recusá-lo,
                autorizo o crédito, em minha conta-corrente, do valor pago indicado
                nesta transação. <br />
                ATENÇÃO: Prezado cliente, este pagamento não poderá ser cancelado
                após efetivação.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer2">Ouvidoria MB <b>0800 707 0384</b></p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer3">SAC MB <b>0800 707 0398</b></p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer3">
                SAC PARA DEFICIENTES AUDITIVOS OU DE FALA <b>0800 70 70 391</b>
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer3"><b>2ª VIA</b></p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Gerar Comprovante - Ficha de Compensação
        </h1>
        <p className={styles.subtitle}>
          Preencha os campos abaixo para gerar o comprovante de pagamento.
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

          <div className={styles.formGroup}>
            <label htmlFor="convenio" className={styles.label}>
              Convênio
            </label>
            <input
              ref={convenioRef}
              id="convenio"
              type="text"
              className={styles.input}
              placeholder="Ex: FGTS, INSS, etc."
              value={convenio}
              onChange={(e) => setConvenio(e.target.value)}
            />
          </div>

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
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Nº da Transação:</span>
                      <span className={styles.infoValue}>
                        {extractedData.nsu}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Valor do Documento:
                      </span>
                      <span className={styles.infoValue}>
                        {extractedData.valorDocumento}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Valor a Pagar:</span>
                      <span className={styles.infoValue}>
                        {extractedData.valorPago}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Data do Pagamento:
                      </span>
                      <span className={styles.infoValue}>
                        {extractedData.dataPagamento}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Data de Vencimento:
                      </span>
                      <span className={styles.infoValue}>
                        {extractedData.dataVencimento}
                      </span>
                    </div>
                    <div className={styles.infoItemFull}>
                      <span className={styles.infoLabel}>
                        Código de Barras:
                      </span>
                      <span className={styles.infoValue}>
                        {extractedData.codigoBarras}
                      </span>
                    </div>
                    <div className={styles.infoItemFull}>
                      <span className={styles.infoLabel}>Nome:</span>
                      <span className={styles.infoValue}>
                        {extractedData.nome}
                      </span>
                    </div>
                    <div className={styles.infoItemFull}>
                      <span className={styles.infoLabel}>CPF/CNPJ:</span>
                      <span className={styles.infoValue}>
                        {extractedData.cpfCnpj}
                      </span>
                    </div>
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
              <li>Cole o LOG completo da transação no campo à esquerda</li>
              <li>Informe o nome do convênio (ex: FGTS, INSS)</li>
              <li>Verifique se os dados foram detectados corretamente</li>
              <li>Clique em "Gerar Comprovante" para baixar o PDF</li>
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

export default ReceiptGenerator;
