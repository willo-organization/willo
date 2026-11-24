import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "motion/react";
import {
  Bancos,
  Camino,
  Cierre,
  Competencia,
  DEMO_URL,
  Equipo,
  Familias,
  Hero,
  LecturaFacil,
  Ley,
  Mercado,
  Momentos,
  Numeros,
  ParaQuien,
  Probar,
  Tecnologia,
  TuDecides,
} from "./sections";

/** Enlaces de la cabecera y las secciones que cubre cada uno (para marcar dónde estás). */
const NAV = [
  { href: "#como-funciona", label: "Cómo funciona", ids: ["como-funciona", "probar", "momentos", "tecnologia", "lectura-facil"] },
  { href: "#familias", label: "Familias", ids: ["familias"] },
  { href: "#bancos", label: "Bancos", ids: ["bancos", "mercado", "numeros", "competencia", "camino"] },
  { href: "#equipo", label: "Equipo", ids: ["equipo"] },
];

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    // Activa la sección que cruza la mitad de la pantalla.
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-50% 0px -50% 0px" });
    document.querySelectorAll("main section[id], footer[id]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const active = useActiveSection();
  const [menu, setMenu] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#para-quien" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-verde focus:px-4 focus:py-2 focus:text-crema">
        Saltar al contenido
      </a>

      <header className="fixed inset-x-0 top-0 z-40 bg-fondo/95">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-10 lg:px-16">
          <a href="#inicio" aria-label="Willo, ir al inicio" className="titular text-3xl font-semibold tracking-[-0.03em] text-verde">
            willo
          </a>
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map((l) => {
                const on = l.ids.includes(active);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={on ? "true" : undefined}
                      className={`rounded-full px-4 py-2 text-base font-semibold transition-colors duration-300 ${on ? "bg-salvia text-verde" : "text-texto hover:bg-salvia/60"}`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-verde px-4 py-2.5 text-base font-bold text-crema transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-texto active:scale-[0.97] sm:px-5">
              Probar la demo
            </a>
            {/* Menú del móvil: los mismos apartados que la barra de escritorio. */}
            <button
              type="button"
              aria-expanded={menu}
              aria-controls="menu-movil"
              onClick={() => setMenu((m) => !m)}
              className="rounded-full bg-salvia px-4 py-2.5 text-base font-bold text-verde transition-colors active:scale-[0.97] md:hidden"
            >
              {menu ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav
              id="menu-movil"
              aria-label="Principal"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-fondo px-5 pb-6 pt-2 md:hidden"
            >
              <ul className="flex flex-col gap-1">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setMenu(false)} className="titular block rounded-2xl px-4 py-3 text-3xl font-semibold text-texto active:bg-salvia">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-verde" />
      </header>

      <main>
        <Hero />
        <ParaQuien />
        <Ley />
        <TuDecides />
        <Probar />
        <Momentos />
        <Tecnologia />
        <LecturaFacil />
        <Familias />
        <Bancos />
        <Mercado />
        <Numeros />
        <Competencia />
        <Camino />
        <Equipo />
      </main>
      <Cierre />
    </MotionConfig>
  );
}
