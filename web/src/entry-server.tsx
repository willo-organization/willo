// Render en el servidor (solo al compilar): genera el HTML de la página para que los
// buscadores lean todo el texto sin ejecutar JavaScript. Lo usa scripts/prerender.mjs.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
