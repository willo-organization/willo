# Willo · Web

Web de Willo (React + Vite + Tailwind + Motion). La portada usa la misma animación de partículas que el pitch (`src/components/ParticleText.tsx`, copiado de la rama `pitch-vercel`).

## Arrancar

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Publicar en Cloudflare Pages

Workers & Pages → Create → Pages → conectar el repo de GitHub, con estos ajustes:

| Ajuste | Valor |
|---|---|
| Framework preset | Vite (o None) |
| Root directory | `web` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Es una sola página: no hacen falta `_redirects` ni variables de entorno.
