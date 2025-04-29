import React from "react";
import CustomizableReceiptGenerator from "/components/CustomizableReceiptGenerator";

// Configuração para comprovante FGTS
const fgtsReceiptConfig = {
  title: "Gerar Comprovante - FGTS",
  subtitle: "Preencha os campos abaixo para gerar o comprovante de pagamento.",

  // Sem campos adicionais no formulário para o FGTS
  formFields: [],

  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor do Documento" },
    { id: "valorPago", label: "Valor Pago" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "dataVencimento", label: "Data de Vencimento" },
    { id: "competencia", label: "Competência" },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
    { id: "convenio", label: "Convênio" },
  ],

  fileNamePrefix: "comprovante_fgts_",
  numZeros: 10,

  // Template HTML para o comprovante FGTS
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
                Recolhimento FGTS
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

          <tr>
            <td><br /></td>
            <td></td>
          </tr>
          <tr class="mb">
            <td>Data do Pagamento</td>
            <td id="dataMovimento"></td>
          </tr>
          <tr class="mb">
            <td>Competência</td>
            <td id="competencia"></td>
          </tr>
          <tr class="mb">
            <td>Data do Vencimento</td>
            <td id="dataVencimento"></td>
          </tr>
          <tr class="mb">
            <td>Valor do Documento</td>
            <td id="valorDocumento"></td>
          </tr>
          <tr class="mb">
            <td>Valor dos Juros/Multa</td>
            <td id="jurosMulta"></td>
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
            <td>Convenio</td>
            <td id="convenio"></td>
          </tr>
          <tr class="mb">
            <td>NSU</td>
            <td id="nsu"></td>
          </tr>
          <tr class="mb">
            <td>Agência Recebedora</td>
            <td id="agenciaRecebedora"></td>
          </tr>
          <tr class="mb">
            <td>Autenticação</td>
            <td id="autenticacao"></td>
          </tr>

          <tr>
            <td colspan="2">
              <p class="footer1">
                Este documento deve ser mantido anexado à GFIP ou documento
                equivalente. Os Dados da obrigação informados para emissão deste
                comprovante são de responsabilidade exclusiva do contribuínte.
                <br />
                Declaro estar ciente de que havendo informações inexatas por mim
                prestadas durante a transação que gerou este documento a conveniada
                poderá não efetivar a baixa do pagamento, e desobrigo neste ato o
                Mercantil do Brasil de qualquer responsabilidade sobre a cobrança de
                complemento ou de erncargos.
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
};

// Componente que renderiza apenas o gerador de comprovante FGTS
const FGTSReceiptGenerator = () => {
  return <CustomizableReceiptGenerator config={fgtsReceiptConfig} />;
};

export default FGTSReceiptGenerator;
