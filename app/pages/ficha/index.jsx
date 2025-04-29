import React from "react";
import CustomizableReceiptGenerator from "/components/CustomizableReceiptGenerator";

// Configuração para comprovante de Ficha de Compensação
const compensationSlipReceiptConfig = {
  title: "Gerar Comprovante - Ficha de Compensação",
  subtitle: "Preencha os campos abaixo para gerar o comprovante de pagamento.",

  // Sem campos adicionais no formulário
  formFields: [],

  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor Nominal" },
    { id: "valorPago", label: "Valor Pago" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "dataVencimento", label: "Data de Vencimento" },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
    { id: "cpfCnpj", label: "CPF/CNPJ", fullWidth: true },
  ],

  fileNamePrefix: "comprovante_ficha_",
  numZeros: 10,

  // Template HTML para o comprovante de Ficha de Compensação
  receiptTemplate: `
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
              <div class="logo"><img src="/logomerc.png"></div><br />
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
  `,

  // Configurações customizadas para extratores de dados específicos
  customExtractors: {
    // Extrator customizado para CPF/CNPJ
    cpfCnpj: (textContent) => {
      const cpfcnpjMatch = textContent.match(
        /CPF\/CNPJ do sacado\s*:\s*(\d+)/i,
      );
      if (cpfcnpjMatch && cpfcnpjMatch[1]) {
        const numero = cpfcnpjMatch[1];

        if (/^\d{14}$/.test(numero) && /^[1-9]/.test(numero.substr(0, 3))) {
          // Se o número tem exatamente 14 dígitos e os três primeiros não são zero, é CNPJ
          return numero.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            "$1.$2.$3/$4-$5",
          );
        } else {
          // Do contrário CPF
          return numero
            .substr(3)
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
      }
      return "";
    },
  },
};

// Componente que renderiza o gerador de comprovante de Ficha de Compensação
const CompensationSlipReceiptGenerator = () => {
  return (
    <CustomizableReceiptGenerator config={compensationSlipReceiptConfig} />
  );
};

export default CompensationSlipReceiptGenerator;
