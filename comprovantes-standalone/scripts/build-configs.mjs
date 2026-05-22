/**
 * Gera js/configs.js a partir das configs do app React (app/pages/.../index.jsx).
 * Fallback: app/pages/teste/index.jsx (das, fgts, consumo).
 *
 * Uso (na raiz do repo): node comprovantes-standalone/scripts/build-configs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = path.resolve(__dirname, "..");
const APP_ROOT = path.resolve(STANDALONE_ROOT, "..", "app");

const PAGE_MAP = [
  { tipo: "consumo", file: "pages/consumo/index.jsx", name: "utilityBillReceiptConfig" },
  { tipo: "das", file: "pages/das/index.jsx", name: "dasReceiptConfig" },
  { tipo: "fgts", file: "pages/fgts/index.jsx", name: "fgtsReceiptConfig" },
  { tipo: "gps", file: "pages/gps/index.jsx", name: "gpsReceiptConfig" },
  { tipo: "dae", file: "pages/dae/index.jsx", name: "daeDafReceiptConfig" },
  { tipo: "ficha", file: "pages/ficha/index.jsx", name: "compensationSlipReceiptConfig" },
  {
    tipo: "tributo_municipal",
    file: "pages/tributo_municipal/index.jsx",
    name: "municipalTaxReceiptConfig",
  },
];

/** Descobre automaticamente config-sources/*.js (ignora _*.js) */
function discoverStandaloneConfigs() {
  const dir = path.join(STANDALONE_ROOT, "config-sources");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js") && !f.startsWith("_"))
    .map((f) => {
      const tipo = f.replace(/\.js$/, "");
      const source = fs.readFileSync(path.join(dir, f), "utf8");
      const exportMatch = source.match(/export\s+const\s+(\w+)\s*=/);
      if (!exportMatch) return null;
      return { tipo, file: `config-sources/${f}`, name: exportMatch[1] };
    })
    .filter(Boolean);
}

function extractConfigObject(source, varName) {
  const regex = new RegExp(`(?:export\\s+)?const\\s+${varName}\\s*=\\s*`);
  const match = source.match(regex);
  if (!match) return null;

  const startIdx = source.indexOf("{", match.index);
  if (startIdx === -1) return null;

  let depth = 0;
  let inTemplate = false;
  let escaped = false;

  for (let i = startIdx; i < source.length; i++) {
    const ch = source[i];

    if (inTemplate) {
      if (!escaped && ch === "`") inTemplate = false;
      escaped = !escaped && ch === "\\";
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        const objStr = source.slice(startIdx, i + 1);
        return new Function(`return ${objStr}`)();
      }
    }
  }

  return null;
}

function loadFromFile(relativePath, varName, root) {
  const base = root || APP_ROOT;
  const full = path.join(base, relativePath);
  if (!fs.existsSync(full)) return null;
  const source = fs.readFileSync(full, "utf8");
  return extractConfigObject(source, varName);
}

function loadFromTeste(tipo) {
  const testePath = path.join(APP_ROOT, "pages/teste/index.jsx");
  if (!fs.existsSync(testePath)) return null;
  const source = fs.readFileSync(testePath, "utf8");
  const marker = "const receiptConfigs = ";
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const objStart = source.indexOf("{", start);
  const typesMarker = source.indexOf("const receiptTypes", objStart);
  const objEnd = source.lastIndexOf("};", typesMarker);
  if (objStart === -1 || objEnd === -1) return null;
  const objLiteral = source.slice(objStart, objEnd + 1);
  const all = new Function(`return ${objLiteral};`)();
  return all[tipo] || null;
}

function sanitizeConfig(config) {
  const copy = JSON.parse(
    JSON.stringify(config, (_, v) => {
      if (typeof v === "function") return undefined;
      return v;
    }),
  );
  copy.receiptTemplate = config.receiptTemplate;
  return copy;
}

function buildExtras(rawConfigs) {
  const conditional = {};
  const extractors = {};

  for (const [tipo, cfg] of Object.entries(rawConfigs)) {
    if (cfg.conditionalFields?.length) {
      conditional[tipo] = cfg.conditionalFields.map((f) => ({
        id: f.id,
        removePattern: f.removePattern || "",
        conditionSrc: f.condition ? f.condition.toString() : "function() { return true; }",
      }));
    }
    if (cfg.customExtractors) {
      extractors[tipo] = {};
      for (const [key, fn] of Object.entries(cfg.customExtractors)) {
        extractors[tipo][key] = fn.toString();
      }
    }
  }

  return { conditional, extractors };
}

function writeExtras(conditional, extractors) {
  const condPath = path.join(STANDALONE_ROOT, "js", "conditional-rules.js");
  const extPath = path.join(STANDALONE_ROOT, "js", "custom-extractors.js");

  const condBody = `/* Gerado automaticamente */
(function (global) {
  const raw = ${JSON.stringify(conditional, null, 2)};
  global.RECEIPT_CONDITIONAL_RULES = {};
  for (const tipo of Object.keys(raw)) {
    global.RECEIPT_CONDITIONAL_RULES[tipo] = raw[tipo].map(function (rule) {
      return {
        id: rule.id,
        removePattern: rule.removePattern,
        condition: (0, eval)("(" + rule.conditionSrc + ")"),
      };
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
`;

  const extBody = `/* Gerado automaticamente */
(function (global) {
  const raw = ${JSON.stringify(extractors, null, 2)};
  global.RECEIPT_CUSTOM_EXTRACTORS = {};
  for (const tipo of Object.keys(raw)) {
    global.RECEIPT_CUSTOM_EXTRACTORS[tipo] = {};
    for (const key of Object.keys(raw[tipo])) {
      global.RECEIPT_CUSTOM_EXTRACTORS[tipo][key] = (0, eval)("(" + raw[tipo][key] + ")");
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
`;

  fs.writeFileSync(condPath, condBody, "utf8");
  fs.writeFileSync(extPath, extBody, "utf8");
}

const configs = {};
const rawConfigs = {};
const log = [];

for (const { tipo, file, name } of PAGE_MAP) {
  let cfg = loadFromFile(file, name);
  if (!cfg) cfg = loadFromTeste(tipo);
  if (cfg) {
    rawConfigs[tipo] = cfg;
    configs[tipo] = sanitizeConfig(cfg);
    log.push(`✓ ${tipo} (${cfg.title || tipo})`);
  } else {
    log.push(`✗ ${tipo} — arquivo não encontrado e sem fallback em teste`);
  }
}

for (const { tipo, file, name } of discoverStandaloneConfigs()) {
  const cfg = loadFromFile(file, name, STANDALONE_ROOT);
  if (cfg) {
    rawConfigs[tipo] = cfg;
    configs[tipo] = sanitizeConfig(cfg);
    log.push(`✓ ${tipo} (${cfg.displayLabel || cfg.title || tipo}) [config-sources]`);
  } else {
    log.push(`✗ ${tipo} — falha ao ler config-sources/${tipo}.js`);
  }
}

const { conditional, extractors } = buildExtras(rawConfigs);
writeExtras(conditional, extractors);

const outPath = path.join(STANDALONE_ROOT, "js", "configs.js");
const body = `/* Gerado automaticamente — não edite. Rode: node comprovantes-standalone/scripts/build-configs.mjs */
(function (global) {
  global.RECEIPT_CONFIGS = ${JSON.stringify(configs, null, 2)};
})(typeof window !== "undefined" ? window : globalThis);
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, body, "utf8");

console.log("Build configs standalone:\\n" + log.join("\\n"));
console.log(`\\nArquivo: ${outPath}`);
const standaloneCount = discoverStandaloneConfigs().length;
const expected = PAGE_MAP.length + standaloneCount;
console.log(`Tipos gerados: ${Object.keys(configs).length}/${expected}`);

if (Object.keys(configs).length === 0) {
  process.exitCode = 1;
}
