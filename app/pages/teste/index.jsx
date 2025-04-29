import React, { useState } from "react";
import CustomizableReceiptGenerator from "/components/CustomizableReceiptGenerator";

// Configurações de diferentes tipos de comprovantes
const receiptConfigs = {
  // Configuração de DAS
  das: {
    title: "Gerar Comprovante - DAS",
    subtitle:
      "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    formFields: [
      {
        id: "convenio",
        label: "Convênio",
        placeholder: "Ex: DAS, DARF, etc.",
        required: true,
      },
      {
        id: "possuiCodigo",
        label: "Possui código de barras",
        type: "select",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
        defaultValue: "sim",
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
    fileNamePrefix: "comprovante_das_",
    numZeros: 14,
    conditionalFields: [
      {
        id: "codigoBarras",
        condition: (formValues) => formValues.possuiCodigo === "sim",
        removePattern: '<tr[^>]*id="codigo"[^>]*>.*?</tr>',
      },
    ],
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
              color: #325797 !important;
            }
            .footer1, .footer2, .footer3 {
              text-align: center;
              margin: 0.5px;
            }
            .footer1 {
              font-weight: 600;
              color: #000000 !important;
            }
            .logo {
              margin: 2px 0 9px;
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
                  Pagamento de DAS
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
              <td>Nome do Convênio</td>
              <td id="convenio"></td>
            </tr>
            <tr class="mb" id="codigo">
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
                <p class="footer1">
                  Comprovante aprovado pela SRF - ADE Conjunto Corat/Cotec numero 001/2006. <br>
                  Guarde este comprovante junto com o DARF/DARF SIMPLES. <br>
                  Declaro estar ciente de que havendo informações inexatas por mim prestadas durante a transação que gerou este documento a Receita Federal do Brasil poderá
                  não efetivar a baixa do documento, e desobrigo neste ato o Banco Mercantil de qualquer responsabilidade sobre a cobrança de complemento ou de encargos.
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
  },

  // Configuração de FGTS
  fgts: {
    title: "Gerar Comprovante - FGTS",
    subtitle:
      "Preencha os campos abaixo para gerar o comprovante de pagamento.",
    formFields: [],
    extractFields: [
      { id: "nsu", label: "Nº da Transação" },
      { id: "valorDocumento", label: "Valor do Documento" },
      { id: "dataPagamento", label: "Data de Pagamento" },
      { id: "dataVencimento", label: "Data de Vencimento" },
      { id: "competencia", label: "Competência" },
      { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
      { id: "nome", label: "Nome", fullWidth: true },
      { id: "convenio", label: "Convênio" },
    ],
    fileNamePrefix: "comprovante_fgts_",
    numZeros: 10,
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
  },

  // Configuração de Conta de Consumo
  consumo: {
    title: "Gerar Comprovante - Contas de Consumo",
    subtitle:
      "Preencha os campos abaixo para gerar o comprovante de pagamento.",
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
  },
};

// Lista de tipos de comprovantes disponíveis
const receiptTypes = [
  { id: "das", label: "DAS" },
  { id: "fgts", label: "FGTS" },
  { id: "consumo", label: "Contas de Consumo" },
];

// Componente principal do aplicativo de geração de comprovantes
const ReceiptGeneratorApp = () => {
  const [receiptType, setReceiptType] = useState("das");

  // Função para lidar com a mudança de tipo de comprovante
  const handleReceiptTypeChange = (e) => {
    setReceiptType(e.target.value);
  };

  return (
    <div className="receipt-generator-app">
      <div
        className="receipt-type-selector"
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <label
          htmlFor="receipt-type"
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Tipo de Comprovante:
        </label>
        <select
          id="receipt-type"
          value={receiptType}
          onChange={handleReceiptTypeChange}
          style={{
            padding: "0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        >
          {receiptTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Renderizar o gerador de comprovante com a configuração selecionada */}
      <CustomizableReceiptGenerator config={receiptConfigs[receiptType]} />
    </div>
  );
};

export default ReceiptGeneratorApp;
