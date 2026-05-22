# Comprovantes Standalone (HTML + JS)

Versão **sem React** do gerador de comprovantes, pensada para embed em ASP.NET legado (ou qualquer HTML/JS puro).

Contém **apenas o main content** (formulário + preview + geração de PDF), sem sidebar ou layout do Bank Utilities.

## Estrutura

```
comprovantes-standalone/
├── index.html                 # Lista de tipos (grid)
├── comprovante.html           # Gerador (?tipo=consumo)
├── css/receipt-generator.css
├── js/
│   ├── receipt-utils.js       # Helpers (displayLabel, escapeHtml)
│   ├── configs.js             # Gerado — templates e metadados
│   ├── conditional-rules.js   # Gerado — regras condicionais do PDF
│   ├── custom-extractors.js   # Gerado — extractors customizados
│   └── receipt-engine.js      # Motor principal
├── config-sources/            # Configs só standalone (auto-descobertas)
│   ├── _template.js           # Modelo para novos tipos
│   ├── ipva_mg.js
│   └── dare_sp.js
├── scripts/
│   ├── build-configs.mjs      # Gera js/configs.js
│   └── scaffold-config.mjs    # Cria novo tipo a partir do template
├── embed/aspnet-exemplo.aspx
└── README.md
```

## Uso local

```bash
npx serve comprovantes-standalone
```

- `http://localhost:3000/` — lista de tipos
- `http://localhost:3000/comprovante.html?tipo=dare_sp` — gerador DARE SP
- `?theme=dark` — tema escuro

---

## Como criar um novo tipo de comprovante

Existem **dois caminhos**. Escolha um:

| Caminho | Quando usar |
|---------|-------------|
| **A — `config-sources/`** | Tipo só no standalone (legado ASP.NET). Mais rápido. |
| **B — `app/pages/`** | Tipo também no app Next.js React. Fonte única para ambos. |

### Caminho A — Standalone only (recomendado para legado)

**1. Gere o arquivo de config**

```bash
node comprovantes-standalone/scripts/scaffold-config.mjs meu_tipo "Meu Tipo"
```

Isso cria `config-sources/meu_tipo.js` a partir de `_template.js`.

**2. Edite a config**

Abra `config-sources/meu_tipo.js` e ajuste:

| Campo | Descrição |
|-------|-----------|
| `displayLabel` | Nome curto no menu e no badge da página |
| `subtitle` | Texto abaixo do título |
| `formFields` | Campos extras (convênio, selects, etc.) |
| `extractFields` | Campos exibidos no preview à direita |
| `receiptTemplate` | HTML do PDF (tabela com `<td id="...">` vazios) |
| `customExtractors` | Funções para extrair campos do LOG |
| `numZeros` | Zeros na autenticação (10 ou 14, conforme legado) |
| `authIncludeHorario` | `false` se a autenticação **não** incluir horário |
| `requireBarcode` | `false` se código de barras for opcional |
| `conditionalFields` | Linhas do PDF removidas condicionalmente |

O **slug do arquivo** vira o parâmetro URL: `meu_tipo.js` → `?tipo=meu_tipo`.

**3. Regenere os JS**

```bash
node comprovantes-standalone/scripts/build-configs.mjs
```

**4. Teste**

Abra `comprovante.html?tipo=meu_tipo`.

> Novos arquivos em `config-sources/` são **descobertos automaticamente** (exceto `_*.js`).

### Caminho B — React + Standalone

1. Crie `app/pages/meu_tipo/index.jsx` exportando `meuTipoReceiptConfig` (copie estrutura de `app/pages/dae/index.jsx`).
2. Adicione a rota em `app/pages/comprovante/[tipo].jsx` se necessário.
3. Inclua o tipo em `PAGE_MAP` dentro de `scripts/build-configs.mjs`.
4. Rode `node comprovantes-standalone/scripts/build-configs.mjs`.

---

## Referência da config

### Campos do formulário (`formFields`)

```javascript
formFields: [
  { id: "convenio", label: "Convênio", placeholder: "...", required: true },
  {
    id: "possuiCodigo",
    label: "Possui código de barras",
    type: "select",
    options: [{ value: "sim", label: "Sim" }, { value: "nao", label: "Não" }],
    defaultValue: "sim",
    required: true,
  },
]
```

### Preview (`extractFields`)

Ids devem corresponder aos dados extraídos pelo motor ou por `customExtractors`:

```javascript
extractFields: [
  { id: "nsu", label: "Nº da Transação" },
  { id: "valorDocumento", label: "Valor" },
  { id: "codigoBarras", label: "Código de Barras", fullWidth: true },
]
```

### Template PDF (`receiptTemplate`)

Use células vazias com `id`. O motor preenche automaticamente:

| ID no template | Origem |
|----------------|--------|
| `valorPago` | Valor formatado |
| `dataMovimento` | Data do pagamento |
| `dataVencimento` / `vencimento` | Vencimento |
| `nsu`, `numerotransação` | NSU |
| `autenticacao` | Calculada (prefixo `0389`) |
| `canalPagamento`, `formaPagamento` | Do LOG |
| `agenciaconta`, `nomepagador` | Do LOG |
| `convenio`, `municipio` | Formulário ou LOG |
| `DataEmissão` | Data/hora atual |

Campos extras via `customExtractors`: `exercicio`, `renavam`, `cotaParcela`, `controleDARE`, `docDae`, etc.

### Autenticação

Padrão do motor:

```
agencia + ano + mes + dia + [horario] + zeros(valor) + nsu
```

- `numZeros: 10` — IPVA MG
- `numZeros: 14` — maioria dos demais
- `authIncludeHorario: false` — DARE SP (sem horário no meio)

### Extractors customizados

```javascript
customExtractors: {
  meuCampo: (textContent) => {
    const m = textContent.match(/Meu campo\s*:\s*(.+)/i);
    return m ? m[1].trim() : "";
  },
}
```

---

## Sincronizar configs

Sempre após editar configs:

```bash
node comprovantes-standalone/scripts/build-configs.mjs
```

Gera/atualiza:
- `js/configs.js`
- `js/custom-extractors.js`
- `js/conditional-rules.js`

No app Next.js também existe `npm run build:standalone` (em `app/`).

---

## Embed em ASP.NET

1. Copie `comprovantes-standalone/` para o projeto (ex.: `wwwroot/comprovantes/`).
2. Logo em `logomerc.png` (raiz) ou `assets/logomerc.png`. Passe `logoUrl` no init se estiver em outro caminho.
3. Veja `embed/aspnet-exemplo.aspx`.

```html
<link rel="stylesheet" href="/comprovantes/css/receipt-generator.css" />
<div id="receipt-root"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.3/html2pdf.bundle.min.js"></script>
<script src="/comprovantes/js/receipt-utils.js"></script>
<script src="/comprovantes/js/configs.js"></script>
<script src="/comprovantes/js/conditional-rules.js"></script>
<script src="/comprovantes/js/custom-extractors.js"></script>
<script src="/comprovantes/js/receipt-engine.js"></script>
<script>
  ReceiptGenerator.init({
    container: "#receipt-root",
    tipo: "consumo",
    logoUrl: "/comprovantes/assets/logomerc.png",
    backHref: false
  });
</script>
```

---

## API JS

```javascript
ReceiptGenerator.init({ container: "#receipt-root", tipo: "gps", logoUrl: "..." });
ReceiptGenerator.listTipos();
ReceiptGenerator.getConfig("das");
ReceiptUtils.getDisplayLabel("dae", config);
```

## Tipos atuais

Gerados automaticamente a partir do React + `config-sources/`:

- `consumo`, `das`, `fgts`, `gps`, `dae`, `ficha`, `tributo_municipal`
- `ipva_mg`, `dare_sp` (standalone)

## Dependências

- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (CDN) — PDF no browser
