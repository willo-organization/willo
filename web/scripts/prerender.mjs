// Mete en dist/index.html el HTML ya renderizado de la página (lo que genera entry-server).
// Se ejecuta después de `vite build` y `vite build --ssr`; ver "build" en package.json.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const { render } = await import(pathToFileURL(raiz + "dist-ssr/entry-server.js").href);

const html = render();
if (!html.includes("Tu voluntad, tu dinero")) throw new Error("El prerender no contiene el titular: algo ha fallado.");

const fichero = raiz + "dist/index.html";
const plantilla = readFileSync(fichero, "utf8");
const marca = '<div id="root"></div>';
if (!plantilla.includes(marca)) throw new Error(`No encuentro ${marca} en dist/index.html`);
writeFileSync(fichero, plantilla.replace(marca, `<div id="root">${html}</div>`));
rmSync(raiz + "dist-ssr", { recursive: true, force: true });
console.log(`Prerender: ${Math.round(html.length / 1024)} KB de HTML en dist/index.html`);
