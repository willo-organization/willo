import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/figtree";
import "./index.css";
import App from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// En producción el HTML ya viene renderizado (scripts/prerender.mjs): se hidrata. En desarrollo, se pinta.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
