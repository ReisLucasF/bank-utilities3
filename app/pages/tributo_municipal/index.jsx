import React from "react";
import CustomizableReceiptGenerator from "/components/CustomizableReceiptGenerator";

// Configuração para comprovante de Tributo Municipal
const municipalTaxReceiptConfig = {
  title: "Gerar Comprovante - Tributo Municipal",
  subtitle: "Preencha os campos abaixo para gerar o comprovante de pagamento.",

  // Campo adicional para o município
  formFields: [
    {
      id: "municipio",
      label: "Município",
      placeholder: "Informe o município aqui",
      required: true,
    },
  ],

  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "dataVencimento", label: "Data de Vencimento" },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
    { id: "agenciaConta", label: "Agência/Conta", fullWidth: true },
  ],

  fileNamePrefix: "comprovante_tributo_",
  numZeros: 14,

  // Template HTML para o comprovante de Tributo Municipal
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
            margin-bottom: 40px;
            page-break-inside: auto;
          }
          th, td {
            padding: 2px;
            text-align: left;
            font-size: 12px;
            color: #000000 !important;
          }
          .col1 {
            width: 30%;
          }
          .col2 {
            text-align: center;
            font-size: 18px;
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
            margin: 2px 0 9px;
          }
          .mb {
            border-bottom: 1px solid rgba(0, 0, 0, 0.164);
          }
          .foco {
            font-weight: 700;
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
              <h4>
                Remissão de Transação Nº<span id="numerotransação"></span> - Pagamento
                de tributo municipal
              </h4>
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
          <tr>
            <td><br /></td>
            <td></td>
          </tr>
          <tr class="mb">
            <td>Conta a Débito</td>
          </tr>
          <tr class="mb">
            <td>Nome:</td>
            <td id="nomepagador"></td>
          </tr>
          <tr class="mb">
            <td>Agência/Conta:</td>
            <td id="agenciaconta"></td>
          </tr>
          <tr>
            <td><br /></td>
            <td></td>
          </tr>
          <tr class="mb">
            <td>Código de Barras</td>
            <td id="codigoBarras"></td>
          </tr>
          <tr class="mb">
            <td>Valor Pago</td>
            <td id="valorPago"></td>
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
            <td>Município</td>
            <td id="municipio"></td>
          </tr>
          <tr>
            <td><br /></td>
            <td></td>
          </tr>
          <tr class="mb">
            <td>Autenticação</td>
            <td id="autenticacao"></td>
          </tr>

          <tr>
            <td colspan="2">
              <p class="footer1">Operação realizada mediante débito em conta.</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer2">Ouvidoria MB <b>0800 707 0384</b></p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer3">SAC MB <b>0800 707 398</b></p>
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
              <p class="footer3">WhatsApp: <b>bm.b.br/mel</b></p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p class="footer3">
                <b>alo@mercantil.com.br</b>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  // Customizações específicas
  customExtractors: {
    // Extrator customizado para agência/conta
    agenciaConta: (textContent) => {
      const agenciaRecebedoraMatch = textContent.match(
        /Agencia recebedora\s*:\s*(\d+)/i,
      );
      const contaMatch = textContent.match(
        /Conta para Debito\s*:\s*([^\n]+)\b/i,
      );

      if (agenciaRecebedoraMatch && contaMatch) {
        return `${agenciaRecebedoraMatch[1]}/${contaMatch[1]}`;
      }
      return "";
    },

    // Extrator para nome do cliente
    nome: (textContent) => {
      const nomeMatch = textContent.match(/Nome do cliente\s*:\s*(.+)/i);
      return nomeMatch ? nomeMatch[1] : "";
    },
  },
};

// Componente que renderiza o gerador de comprovante de Tributo Municipal
const MunicipalTaxReceiptGenerator = () => {
  return <CustomizableReceiptGenerator config={municipalTaxReceiptConfig} />;
};

export default MunicipalTaxReceiptGenerator;
