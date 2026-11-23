import { useEffect, useState } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import {
  Ana,
  Cierre,
  Circulo,
  Competencia,
  DEMO_URL,
  Demo,
  Equipo,
  GoToMarket,
  Hero,
  Javi,
  LecturaFacil,
  Mercado,
  Momentos,
  Negocio,
  Numeros,
  Problema,
  Pruebalo,
  Solucion,
  Tecnologia,
} from "./sections";

/** Apartados del índice lateral (id de la sección y nombre corto). Mismo orden que el pitch. */
const INDICE = [
  ["inicio", "Inicio"],
  ["javi", "Javi"],
  ["problema", "El problema"],
  ["solucion", "La solución"],
  ["mercado", "El mercado"],
  ["competencia", "Competencia"],
  ["demo", "Demo"],
  ["momentos", "Lo que hace"],
  ["circulo", "Círculo de apoyo"],
  ["ana", "El móvil de Ana"],
  ["tecnologia", "Cómo funciona"],
  ["lectura-facil", "Lectura fácil"],
  ["negocio", "Negocio"],
  ["numeros", "Números"],
  ["go-to-market", "Go to market"],
  ["equipo", "Equipo"],
  ["pruebalo", "Pruébalo"],
  ["cierre", "Cierre"],
] as const;

function useActiveSection() {
  const [active, setActive] = useState("inicio");
  useEffect(() => {
    // Activa la sección que cruza la mitad de la pantalla.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    INDICE.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const active = useActiveSection();

  return (
    <MotionConfig reducedMotion="user">
      <a href="#javi" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-verde focus:px-4 focus:py-2 focus:text-fondo">
        Saltar al contenido
      </a>

      {/* Barra superior: marca, demo y progreso de lectura. */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-texto/5 bg-fondo/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-10 lg:px-20">
          <a href="#inicio" className="titular text-2xl font-semibold text-verde">
            willo
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-verde px-4 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-texto"
          >
            Probar la demo
          </a>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-verde" />
      </header>

      {/* Índice lateral (escritorio): un punto por apartado; el nombre aparece al pasar el ratón. */}
      <nav aria-label="Apartados" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <ul className="flex flex-col items-end gap-2.5">
          {INDICE.map(([id, label]) => {
            const on = id === active;
            return (
              <li key={id}>
                <a href={`#${id}`} aria-current={on ? "true" : undefined} className="group flex items-center gap-3">
                  <span
                    className={`rounded-full bg-texto/80 px-2.5 py-1 text-xs font-semibold text-fondo transition-opacity duration-300 ${
                      on ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`block rounded-full ring-2 ring-fondo/80 transition-all duration-500 ${on ? "h-6 w-1.5 bg-verde" : "h-1.5 w-1.5 bg-salvia-media group-hover:bg-verde"}`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <main>
        <Hero />
        <Javi />
        <Problema />
        <Solucion />
        <Mercado />
        <Competencia />
        <Demo />
        <Momentos />
        <Circulo />
        <Ana />
        <Tecnologia />
        <LecturaFacil />
        <Negocio />
        <Numeros />
        <GoToMarket />
        <Equipo />
        <Pruebalo />
        <Cierre />
      </main>
    </MotionConfig>
  );
}
