<!--
  Exemplo de embed em ASP.NET WebForms (.aspx)
  Copie a pasta comprovantes-standalone para wwwroot ou Content/comprovantes/
-->

<%@ Page Title="Comprovante DARF" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
  <!-- CSS isolado (prefixo rg-) -->
  <link rel="stylesheet" href="<%= ResolveUrl("~/comprovantes-standalone/css/receipt-generator.css") %>" />

  <!-- Somente o main content -->
  <div id="receipt-root"></div>

  <!-- Scripts (ordem importa) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.3/html2pdf.bundle.min.js"></script>
  <script src="<%= ResolveUrl("~/comprovantes-standalone/js/receipt-utils.js") %>"></script>
  <script src="<%= ResolveUrl("~/comprovantes-standalone/js/configs.js") %>"></script>
  <script src="<%= ResolveUrl("~/comprovantes-standalone/js/conditional-rules.js") %>"></script>
  <script src="<%= ResolveUrl("~/comprovantes-standalone/js/custom-extractors.js") %>"></script>
  <script src="<%= ResolveUrl("~/comprovantes-standalone/js/receipt-engine.js") %>"></script>
  <script>
    ReceiptGenerator.init({
      container: "#receipt-root",
      tipo: "dae", // consumo | das | fgts | gps | dae | ficha | tributo_municipal | ipva_mg | dare_sp
      logoUrl: "<%= ResolveUrl("~/comprovantes-standalone/assets/logomerc.png") %>",
      backHref: false
    });
  </script>
</asp:Content>
