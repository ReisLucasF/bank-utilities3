export const dareSpReceiptConfig = {
  displayLabel: "DARE SP",
  title: "Gerar Comprovante - DARE SP",
  subtitle: "Cole o LOG da transação e informe o convênio.",

  formFields: [
    {
      id: "municipio",
      label: "Convênio",
      placeholder: "Informe o convênio aqui",
      required: true,
    },
  ],

  extractFields: [
    { id: "nsu", label: "Nº da Transação" },
    { id: "valorDocumento", label: "Valor" },
    { id: "dataPagamento", label: "Data de Pagamento" },
    { id: "dataVencimento", label: "Data de Vencimento" },
    { id: "controleDARE", label: "Nº de Controle DARE", fullWidth: true },
    { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
    { id: "nome", label: "Nome", fullWidth: true },
    { id: "agenciaConta", label: "Agência/Conta", fullWidth: true },
  ],

  fileNamePrefix: "comprovante_dare_sp_",
  numZeros: 14,
  minBarcodeLength: 44,
  authIncludeHorario: false,

  customExtractors: {
    controleDARE: (textContent) => {
      const m = textContent.match(/Numero de controle\s*:\s*(.+)/i);
      return m ? m[1].trim() : "";
    },
  },

  receiptTemplate: `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Comprovante DARE SP</title>
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
              <h4>Remissão de Transação Nº<span id="numerotransação"></span> — DARE SP</h4>
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
          <tr class="mb"><td>Convênio</td><td id="municipio"></td></tr>
          <tr class="mb"><td>Nº Controle DARE</td><td id="controleDARE"></td></tr>
          <tr class="mb"><td>Código de Barras</td><td id="codigoBarras"></td></tr>
          <tr class="mb"><td>Valor Pago</td><td id="valorPago"></td></tr>
          <tr class="mb"><td>Data do Pagamento</td><td id="dataMovimento"></td></tr>
          <tr class="mb"><td>Data de Vencimento</td><td id="dataVencimento"></td></tr>
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
