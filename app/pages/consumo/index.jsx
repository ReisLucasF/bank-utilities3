import React from "react";
import CustomizableReceiptGenerator from "/components/CustomizableReceiptGenerator";

// Configuração para comprovante de Contas de Consumo
export const utilityBillReceiptConfig = {
  title: "Gerar Comprovante - Contas de Consumo",
  subtitle: "Preencha os campos abaixo para gerar o comprovante de pagamento.",

  formFields: [
    {
      id: "convenio",
      label: "Convênio",
      placeholder: "Ex: CEMIG, COPASA, SABESP, etc.",
      required: true,
    },
  ],

  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
    { id: "agenciaConta", label: "Agência/Conta", fullWidth: true },
  ],

  fileNamePrefix: "comprovante_consumo_",
  numZeros: 14,

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
              <h4>
                Remissão de Transação Nº<span id="numerotransação"></span> -
                Pagamento de conta consumo
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
            <td>Data do Pagamento</td>
            <td id="dataMovimento"></td>
          </tr>
          <tr class="mb">
            <td>Convênio</td>
            <td id="convenio"></td>
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
                Informações sujeitas a confirmação. A efetivação dessa operação será
                mediante débito em conta corrente. <br />
                Autorizo o débito em minha conta corrente de eventual diferença
                apurada em razão de informações inexatas por mim prestadas.
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
};

// Componente que renderiza apenas o gerador de comprovante de Contas de Consumo
const UtilityBillReceiptGenerator = () => {
  return <CustomizableReceiptGenerator config={utilityBillReceiptConfig} />;
};

export default UtilityBillReceiptGenerator;
