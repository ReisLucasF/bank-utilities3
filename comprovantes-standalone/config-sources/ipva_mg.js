export const ipvaMgReceiptConfig = {
  displayLabel: "IPVA MG",
  title: "Gerar Comprovante - IPVA MG",
  subtitle: "Cole o LOG da transação e informe o convênio.",

  formFields: [
    {
      id: "convenio",
      label: "Convênio",
      placeholder: "Informe o convênio aqui",
      required: true,
    },
  ],

  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "vencimento", label: "Data de Vencimento" },
    { id: "exercicio", label: "Exercício" },
    { id: "renavam", label: "RENAVAM" },
    { id: "cotaParcela", label: "Cota/Parcela", fullWidth: true },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
    { id: "agenciaConta", label: "Agência/Conta", fullWidth: true },
  ],

  fileNamePrefix: "comprovante_ipva_mg_",
  numZeros: 10,
  minBarcodeLength: 44,

  customExtractors: {
    vencimento: (textContent) => {
      const m = textContent.match(/Data de vencimento\s*:\s*([^\n]+)\b/i);
      return m ? m[1].trim() : "";
    },
    exercicio: (textContent) => {
      const m = textContent.match(/Ano de Exercicio\s*:\s*([^\n]+)\b/i);
      return m ? m[1].trim() : "";
    },
    renavam: (textContent) => {
      const m = textContent.match(/Codigo RENAVAM\s*:\s*([^\n]+)\b/i);
      return m ? m[1].trim() : "";
    },
    cotaParcela: (textContent) => {
      const m = textContent.match(/Numero da Parcela\s*:\s*([^\n]+)\b/i);
      if (!m) return "";
      const c = String(m[1]).trim();
      if (c === "1") return "1ª parcela";
      if (c === "2") return "2ª parcela";
      if (c === "3") return "3ª parcela";
      if (c === "4") return "Valor inferior ao mínimo (cota única sem desconto)";
      return "Cota única (com desconto)";
    },
  },

  receiptTemplate: `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Comprovante IPVA MG</title>
        <style>
          * { font-family: "Roboto", sans-serif; color: #000000 !important; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th, td { padding: 2px; text-align: left; font-size: 12px; }
          .col2 { text-align: center; font-size: 18px; color: #325797 !important; }
          .footer1, .footer2, .footer3 { text-align: center; margin: 0.5px; }
          .footer1 { font-weight: 600; }
          .mb { border-bottom: 1px solid rgba(0, 0, 0, 0.164); }
          .foco { font-weight: 700; }
          h4 { font-size: 19px; }
        </style>
      </head>
      <body>
        <table id="comprovanteTable">
          <tr>
            <th class="col2" colspan="2">
              <div class="logo"><img src="/logomerc.png"></div><br />
              <h4>Remissão de Transação Nº<span id="numerotransação"></span> — IPVA MG</h4>
            </th>
          </tr>
          <tr><td colspan="2"><br /></td></tr>
          <tr class="mb"><td>Data de Emissão</td><td id="DataEmissão"></td></tr>
          <tr class="mb"><td>Canal de Pagamento</td><td id="canalPagamento"></td></tr>
          <tr class="mb"><td>Forma de pagamento</td><td id="formaPagamento"></td></tr>
          <tr><td colspan="2"><br /></td></tr>
          <tr class="mb"><td colspan="2">Conta a Débito</td></tr>
          <tr class="mb"><td>Nome:</td><td id="nomepagador"></td></tr>
          <tr class="mb"><td>Agência/Conta:</td><td id="agenciaconta"></td></tr>
          <tr><td colspan="2"><br /></td></tr>
          <tr class="mb"><td>Convênio</td><td id="convenio"></td></tr>
          <tr class="mb"><td>Exercício</td><td id="exercicio"></td></tr>
          <tr class="mb"><td>RENAVAM</td><td id="renavam"></td></tr>
          <tr class="mb"><td>Cota/Parcela</td><td id="cotaParcela"></td></tr>
          <tr class="mb"><td>Código de Barras</td><td id="codigoBarras"></td></tr>
          <tr class="mb"><td>Valor Pago</td><td id="valorPago"></td></tr>
          <tr class="mb"><td>Data do Pagamento</td><td id="dataMovimento"></td></tr>
          <tr class="mb"><td>Data de Vencimento</td><td id="vencimento"></td></tr>
          <tr class="mb"><td>NSU</td><td id="nsu"></td></tr>
          <tr class="mb"><td>Agência Recebedora</td><td id="agenciaRecebedora"></td></tr>
          <tr><td colspan="2"><br /></td></tr>
          <tr class="mb"><td>Autenticação</td><td id="autenticacao"></td></tr>
          <tr><td colspan="2"><p class="footer1">Informações sujeitas a confirmação. Guarde este comprovante.</p></td></tr>
          <tr><td colspan="2"><p class="footer2">Ouvidoria MB <b>0800 707 0384</b></p></td></tr>
          <tr><td colspan="2"><p class="footer3">SAC MB <b>0800 707 0398</b></p></td></tr>
        </table>
      </body>
    </html>
  `,
};
