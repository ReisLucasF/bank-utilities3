/**
 * Cria um novo arquivo de config em config-sources/.
 *
 * Uso: node comprovantes-standalone/scripts/scaffold-config.mjs <slug> ["Nome exibido"]
 * Ex.: node comprovantes-standalone/scripts/scaffold-config.mjs ipva_pr "IPVA PR"
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = path.resolve(__dirname, "..");
const CONFIG_DIR = path.join(STANDALONE_ROOT, "config-sources");

const slug = process.argv[2];
const displayLabel = process.argv[3] || slug;

if (!slug || !/^[a-z][a-z0-9_]*$/.test(slug)) {
  console.error("Uso: node comprovantes-standalone/scripts/scaffold-config.mjs <slug> [\"Nome exibido\"]");
  console.error("Slug: letras minúsculas, números e underscore (ex.: ipva_pr)");
  process.exit(1);
}

const target = path.join(CONFIG_DIR, `${slug}.js`);
if (fs.existsSync(target)) {
  console.error(`Arquivo já existe: ${target}`);
  process.exit(1);
}

const templatePath = path.join(CONFIG_DIR, "_template.js");
if (!fs.existsSync(templatePath)) {
  console.error("Template _template.js não encontrado.");
  process.exit(1);
}

const exportName =
  slug
    .split("_")
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join("") + "ReceiptConfig";

let content = fs.readFileSync(templatePath, "utf8");
content = content.replace(/export const meuTipoReceiptConfig/g, `export const ${exportName}`);
content = content.replace(/displayLabel: "Meu Tipo"/g, `displayLabel: "${displayLabel}"`);
content = content.replace(/Gerar Comprovante - Meu Tipo/g, `Gerar Comprovante - ${displayLabel}`);
content = content.replace(/Comprovante Meu Tipo/g, `Comprovante ${displayLabel}`);
content = content.replace(/Meu Tipo/g, displayLabel);
content = content.replace(/comprovante_meu_tipo_/g, `comprovante_${slug}_`);
content = content.replace(/tipo=meu_tipo/g, `tipo=${slug}`);
content = content.replace(/meu_tipo\.js/g, `${slug}.js`);

fs.writeFileSync(target, content, "utf8");

console.log(`✓ Criado: config-sources/${slug}.js`);
console.log(`\nPróximos passos:`);
console.log(`  1. Edite config-sources/${slug}.js (template PDF, extractors, campos)`);
console.log(`  2. node comprovantes-standalone/scripts/build-configs.mjs`);
console.log(`  3. Abra comprovante.html?tipo=${slug}`);
