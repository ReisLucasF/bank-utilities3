/**
 * TEMPLATE — copie este arquivo para criar um novo tipo de comprovante.
 *
 * 1. Copie:  cp _template.js meu_tipo.js
 *    Ou rode: node comprovantes-standalone/scripts/scaffold-config.mjs meu_tipo "Meu Tipo"
 * 2. Edite os campos abaixo e o receiptTemplate (HTML do PDF).
 * 3. Rode:    node comprovantes-standalone/scripts/build-configs.mjs
 * 4. Acesse:  comprovante.html?tipo=meu_tipo
 *
 * O slug do arquivo (meu_tipo.js) vira o parâmetro ?tipo=meu_tipo na URL.
 */
export const meuTipoReceiptConfig = {
  /** Nome curto no menu e no badge da página */
  displayLabel: "Meu Tipo",

  title: "Gerar Comprovante - Meu Tipo",
  subtitle: "Cole o LOG da transação e preencha os campos necessários.",

  /** Campos extras além do LOG (opcional) */
  formFields: [
    {
      id: "convenio",
      label: "Convênio",
      placeholder: "Informe o convênio aqui",
      required: true,
    },
    // Exemplo select:
    // {
    //   id: "possuiCodigo",
    //   label: "Possui código de barras",
    //   type: "select",
    //   options: [
    //     { value: "sim", label: "Sim" },
    //     { value: "nao", label: "Não" },
    //   ],
    //   defaultValue: "sim",
    //   required: true,
    // },
  ],

  /** Campos exibidos no preview à direita (ids devem bater com extractForPdf / customExtractors) */
  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
  ],

  fileNamePrefix: "comprovante_meu_tipo_",
  numZeros: 14,
  minBarcodeLength: 44,
  // requireBarcode: false,
  // authIncludeHorario: false,

  /** Funções para extrair campos não cobertos pelo motor padrão */
  customExtractors: {
    // meuCampo: (textContent) => {
    //   const m = textContent.match(/Meu campo\s*:\s*(.+)/i);
    //   return m ? m[1].trim() : "";
    // },
  },

  /** Linhas do PDF removidas condicionalmente (ex.: esconder código de barras) */
  // conditionalFields: [
  //   {
  //     id: "codigoBarras",
  //     condition: (formValues) => formValues.possuiCodigo === "sim",
  //     removePattern: '<tr[^>]*>[^<]*codigoBarras.*?</tr>',
  //   },
  // ],

  /** Instruções customizadas (opcional — senão usa as padrão) */
  // instructions: ["Passo 1...", "Passo 2..."],

  /**
   * HTML do PDF. Use ids vazios — o motor preenche via replace:
   * codigoBarras, valorPago, dataMovimento, dataVencimento, vencimento, nsu,
   * agenciaRecebedora, autenticacao, nomepagador, numerotransação, DataEmissão,
   * canalPagamento, formaPagamento, agenciaconta, convenio, municipio, etc.
   */
  receiptTemplate: `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Comprovante Meu Tipo</title>
        <style>
          * { font-family: "Roboto", sans-serif; color: #000 !important; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th, td { padding: 2px; text-align: left; font-size: 12px; }
          .col2 { text-align: center; font-size: 18px; color: #325797 !important; }
          .mb { border-bottom: 1px solid rgba(0,0,0,0.164); }
          .foco { font-weight: 700; }
          h4 { font-size: 19px; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <th class="col2" colspan="2">
              <img src="/logomerc.png" alt="" /><br />
              <h4>Remissão de Transação Nº<span id="numerotransação"></span> — Meu Tipo</h4>
            </th>
          </tr>
          <tr class="mb"><td>Data de Emissão</td><td id="DataEmissão"></td></tr>
          <tr class="mb"><td>Valor Pago</td><td id="valorPago"></td></tr>
          <tr class="mb"><td>NSU</td><td id="nsu"></td></tr>
          <tr class="mb"><td>Autenticação</td><td id="autenticacao"></td></tr>
        </table>
      </body>
    </html>
  `,
};
