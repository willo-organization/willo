import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import ParticleText from "./components/ParticleText";
import { Count, EASE, Eyebrow, Phone, Reveal, T_L, T_XL, Window, Words } from "./components/ui";

export const DEMO_URL = "https://willo-sfh4.onrender.com/demo/banco";
const VERDE = "#3E5A34";
const CREMA = "#F5F7F0";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Progreso de scroll (0 → 1) de una sección. Con "reducir movimiento" activado,
 * devuelve un valor fijo (`rest`) y las animaciones ligadas al scroll se quedan quietas.
 */
function useProgress<T extends HTMLElement = HTMLElement>(offset: Offset = ["start end", "end start"], rest = 0.5) {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  // Pasarlo por una función evita la aceleración nativa (ScrollTimeline) de Motion, que en
  // secciones con sticky dejaba la opacidad y el color de fondo congelados.
  const live = useTransform(scrollYProgress, (v) => v);
  const still = useMotionValue(rest);
  return [ref, useReducedMotion() ? still : live] as const;
}

const PAD = "px-5 sm:px-10 lg:px-20";
const Wrap = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-7xl ${PAD} ${className}`}>{children}</div>
);

/* ───────────────────────── 01 · Portada ───────────────────────── */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const small = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <section ref={ref} id="inicio" className="relative h-svh min-h-[600px]">
      <motion.div style={{ scale, opacity }} className="absolute inset-0">
        {/* shortcut: el ancho se mide solo al cargar; en móvil, menos puntos para que no se amontonen. */}
        <ParticleText
          renderer="canvas"
          text="willo"
          active={inView}
          fitWidth={0.8}
          fitHeight={0.34}
          centerY={0.4}
          maxPoints={small ? 1100 : 3500}
          dotSize={small ? 1.4 : 2}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className={`absolute left-0 right-0 top-24 text-center text-xs font-bold uppercase tracking-[0.2em] text-verde sm:text-sm`}
        >
          El modo fácil de tu banco, por voz
        </motion.p>
        <div className="absolute inset-x-5 top-[62%] flex flex-col items-center gap-5 text-center">
          <h1 className="titular text-[clamp(2rem,5vw,3.8rem)] italic leading-[1.05] text-suave">
            <span className="sr-only">Willo: </span>
            <Words text="Tu voluntad, tu dinero." delay={1.4} />
          </h1>
          <Reveal delay={1.9} y={16}>
            <p className="max-w-xl text-base text-suave sm:text-xl">
              Para personas con discapacidad intelectual. Su asistente se llama Noa.
            </p>
          </Reveal>
        </div>
      </motion.div>
      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-suave"
      >
        Desliza
        <span className="relative h-12 w-px overflow-hidden bg-verde/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-verde"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── 02 · Javi ───────────────────────── */
export function Javi() {
  const [ref, p] = useProgress(["start end", "end start"], 0.5);
  const scale = useTransform(p, [0.05, 0.45], [0.78, 1]);
  const rotate = useTransform(p, [0.05, 0.45], [-7, 0]);
  const y = useTransform(p, [0, 1], [90, -90]);

  return (
    <section ref={ref} id="javi" className="relative overflow-hidden py-28 lg:py-40">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-salvia lg:block" />
      <Wrap className="relative grid items-center gap-16 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col gap-8">
          <Eyebrow n="02">Te presentamos a Javi</Eyebrow>
          <h2 className={T_XL}>
            <Words text="Javi tiene 34 años, trabaja en una lavandería y cobra 980 € al mes." />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-xl leading-snug text-suave sm:text-2xl">La app de su banco usa palabras técnicas y mucho texto.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-2xl text-xl leading-snug text-suave sm:text-2xl">
              Por eso depende de su familia para todo. Y está más expuesto a las estafas.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex max-w-2xl items-center gap-5 rounded-3xl bg-white p-5 shadow-[0_20px_50px_-30px_rgba(14,20,13,0.4)] sm:p-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-verde text-2xl font-bold text-crema">A</span>
              <div>
                <p className="text-lg font-bold sm:text-xl">Ana, su hermana</p>
                <p className="text-suave">Le ayuda con el dinero. Quiere acompañarle, no decidir por él.</p>
              </div>
            </div>
          </Reveal>
        </div>
        <motion.div style={{ scale, rotate, y }} className="mx-auto w-[min(300px,70vw)]">
          <Phone src="/screens/01-inicio.png" alt="Pantalla de inicio de Javi en Willo, con sus huchas" />
        </motion.div>
      </Wrap>
      <Wrap className="relative mt-16">
        <p className="text-sm text-suave">Javi y Ana son los protagonistas de la demo. Sus datos son inventados.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 03 · El problema ───────────────────────── */
export function Problema() {
  const [ref, p] = useProgress(["start start", "end end"], 1);
  // Deszoom: la cifra entra enorme y se encoge hasta su sitio.
  const scale = useTransform(p, [0, 0.4], [2.6, 1]);
  const numOpacity = useTransform(p, [0, 0.12], [0, 1]);
  const restOpacity = useTransform(p, [0.38, 0.52], [0, 1]);
  const restY = useTransform(p, [0.38, 0.52], [30, 0]);
  const barDI = useTransform(p, [0.5, 0.72], [0, 0.33]);
  const barGen = useTransform(p, [0.55, 0.8], [0, 0.84]);
  const endOpacity = useTransform(p, [0.8, 0.92], [0, 1]);

  return (
    <section ref={ref} id="problema" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-14">
        <Wrap className="flex flex-col gap-8">
          <Eyebrow n="03">El problema</Eyebrow>
          <motion.p style={{ scale, opacity: numOpacity }} className="titular origin-left text-[clamp(4rem,15vw,13rem)] font-semibold leading-[0.9] text-verde">
            1 de cada 3
          </motion.p>
          <motion.div style={{ opacity: restOpacity, y: restY }} className="flex flex-col gap-10">
            <h2 className={T_L}>personas con discapacidad intelectual usa internet de forma habitual.</h2>
            <div className="flex max-w-4xl flex-col gap-5">
              <Bar label="Personas con discapacidad intelectual" value="1 de cada 3" width={barDI} strong />
              <Bar label="Población general" value="84 %" width={barGen} />
            </div>
          </motion.div>
          <motion.p style={{ opacity: endOpacity }} className="max-w-3xl text-xl leading-snug sm:text-2xl">
            <b className="text-verde">La oportunidad:</b> desde junio de 2025, la ley obliga a los bancos a ser accesibles.
          </motion.p>
          <p className="text-sm text-suave">Fuente: INE, datos de 2022, citados por Plena inclusión.</p>
        </Wrap>
      </div>
    </section>
  );
}

function Bar({ label, value, width, strong = false }: { label: string; value: string; width: MotionValue<number>; strong?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <p className={`font-bold ${strong ? "" : "text-suave"}`}>{label}</p>
        <p className={`titular text-2xl font-semibold sm:text-3xl ${strong ? "text-verde" : "text-suave"}`}>{value}</p>
      </div>
      <div className="h-5 overflow-hidden rounded-full bg-salvia/50 sm:h-7">
        <motion.div style={{ scaleX: width }} className={`h-full origin-left rounded-full ${strong ? "bg-verde" : "bg-salvia-media"}`} />
      </div>
    </div>
  );
}

/* ───────────────────────── 04 · La solución ───────────────────────── */
export function Solucion() {
  const [ref, p] = useProgress<HTMLDivElement>(["start end", "end end"], 1);
  // Zoom: "Tú decides." crece mientras el fondo pasa de crema a verde.
  const scale = useTransform(p, [0, 0.85], [0.55, 1]);
  const bg = useTransform(p, [0.25, 0.8], [CREMA, VERDE]);
  const color = useTransform(p, [0.25, 0.8], [VERDE, CREMA]);

  return (
    <section id="solucion">
      <Wrap className="grid gap-16 py-28 lg:grid-cols-[1.2fr_0.8fr] lg:py-40">
        <div className="flex flex-col gap-8">
          <Eyebrow n="04">La solución</Eyebrow>
          <h2 className={T_XL}>
            <Words text="Willo es una app de dinero que se usa hablando y en lectura fácil." />
          </h2>
          <Reveal>
            <p className="max-w-2xl text-xl leading-snug text-suave sm:text-2xl">Su asistente, Noa, hace las cuentas en voz alta. Y siempre termina igual:</p>
          </Reveal>
        </div>
        <div className="flex flex-col gap-8 lg:pt-12">
          <Reveal y={16}>
            <p className="font-bold text-verde">Lo que gana Javi</p>
          </Reveal>
          {[
            { t: "Más autonomía", d: "Decide sobre su dinero sin pedir permiso." },
            { t: "Menos estafas", d: "Willo le avisa y le explica por qué." },
            { t: "Menos dependencia", d: "Su familia apoya, pero no decide por él." },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 0.1} className="border-t border-salvia-media pt-5">
              <h3 className="text-2xl font-bold sm:text-3xl">{b.t}</h3>
              <p className="mt-1 text-lg text-suave">{b.d}</p>
            </Reveal>
          ))}
        </div>
      </Wrap>
      <motion.div ref={ref} style={{ backgroundColor: bg }} className="relative h-[170vh]">
        <div className="sticky top-0 grid h-svh place-items-center overflow-hidden">
          <motion.p style={{ scale, color }} className="titular text-[clamp(4.5rem,17vw,16rem)] font-semibold leading-none">
            Tú decides.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── 05 · El mercado ───────────────────────── */
const MERCADO = [
  { k: "TAM", t: "Europa", n: "≈ 7 millones", d: "personas con discapacidad intelectual", e: "≈ 200 M€ al año" },
  { k: "SAM", t: "España", n: "157.895", d: "personas con discapacidad intelectual reconocida", e: "≈ 4,5 M€ al año" },
  { k: "SOM", t: "Organizaciones", n: "13.816", d: "personas en asociaciones", e: "≈ 416.000 € al año" },
];

export function Mercado() {
  const [ref, p] = useProgress<HTMLDivElement>(["start start", "end end"], 0.1);
  // Zoom hacia dentro: de Europa (TAM) a España (SAM) y a las asociaciones (SOM).
  const scale = useTransform(p, [0, 0.3, 0.62, 0.95], [0.92, 1, 1.55, 2.55]);
  const [step, setStep] = useState(0);
  useMotionValueEvent(p, "change", (v) => setStep(v < 0.33 ? 0 : v < 0.66 ? 1 : 2));
  const r = MERCADO[step];

  return (
    <section id="mercado">
      <div ref={ref} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-14">
          <Wrap className="grid items-center gap-8 lg:grid-cols-2">
            <div className="order-2 flex min-h-[15rem] flex-col gap-4 lg:order-1">
              <Eyebrow n="05">El mercado</Eyebrow>
              <AnimatePresence mode="wait">
                <motion.div
                  key={r.k}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex flex-col gap-2"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-suave">
                    {r.k} · {r.t}
                  </p>
                  <h2 className="titular text-[clamp(3rem,7vw,6rem)] font-semibold leading-none text-verde">{r.n}</h2>
                  <p className="text-xl text-suave sm:text-2xl">{r.d}</p>
                  <p className="mt-2 text-xl font-bold sm:text-2xl">{r.e}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-4 flex gap-2" aria-hidden="true">
                {MERCADO.map((m, i) => (
                  <span key={m.k} className={`h-1 rounded-full transition-all duration-500 ${i === step ? "w-10 bg-verde" : "w-4 bg-salvia-media"}`} />
                ))}
              </div>
            </div>
            {/* Ventana que recorta el zoom: los círculos crecen dentro sin tapar el texto. */}
            <div className="relative order-1 mx-auto grid aspect-square w-[min(88vw,50vh,600px)] place-items-center overflow-hidden rounded-[2rem] bg-white/70 shadow-[0_30px_70px_-40px_rgba(14,20,13,0.45)] ring-1 ring-texto/5 lg:order-2 lg:w-[min(42vw,72vh,600px)]">
              <motion.div style={{ scale }} className="relative aspect-square w-[88%]">
                <Ring size="100%" className="bg-salvia text-verde" label="TAM · Europa" active={step === 0} />
                <Ring size="66%" className="bg-salvia-media text-texto" label="SAM · España" active={step === 1} />
                <Ring size="33%" className="bg-verde text-fondo" label="SOM" active={step === 2} center />
              </motion.div>
            </div>
          </Wrap>
        </div>
      </div>
      <Wrap className="grid items-end gap-10 pb-28 lg:grid-cols-2 lg:pb-40">
        <Reveal>
          <div className="flex gap-2" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.svg
                key={i}
                viewBox="0 0 24 40"
                className={`h-12 w-7 sm:h-16 sm:w-9 ${i ? "fill-salvia-media" : "fill-verde"}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: EASE }}
              >
                <circle cx="12" cy="7" r="6" />
                <rect x="2" y="15" width="20" height="25" rx="9" />
              </motion.svg>
            ))}
          </div>
          <p className="titular mt-6 text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none text-verde">1 de cada 10</p>
          <p className="mt-4 max-w-lg text-xl text-suave">Nos basta con llegar al menos a 1 de cada 10 personas que ya apoya Plena inclusión.</p>
        </Reveal>
        <p className="text-sm leading-relaxed text-suave">
          Fuentes: European Psychiatry (2020); IMSERSO (2024); Plena inclusión. SOM: hipótesis del equipo. Ingresos sin IVA, a 2,40 € por usuario (el SOM incluye la cuota base).
        </p>
      </Wrap>
    </section>
  );
}

function Ring({ size, className, label, active, center = false }: { size: string; className: string; label: string; active: boolean; center?: boolean }) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-center rounded-full ${center ? "items-center" : "items-start pt-[5%]"} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className={`text-[clamp(0.6rem,1.6vmin,0.9rem)] font-black uppercase tracking-[0.12em] transition-opacity duration-500 ${active ? "opacity-100" : "opacity-50"}`}>
        {label}
      </span>
    </div>
  );
}

/* ───────────────────────── 06 · La competencia ───────────────────────── */
type V = 1 | 0.5 | 0;
const COLS = [
  { n: "CaixaBank", c: "Cuenta con apoyo" },
  { n: "SpendAble", c: "Australia" },
  { n: "True Link", c: "EE. UU." },
  { n: "BBVA Blue", c: "Asistente con IA" },
  { n: "Willo", c: "España" },
];
const FILAS: { t: string; v: V[]; nota?: (string | undefined)[] }[] = [
  { t: "Se usa hablando", v: [0, 0, 0, 1, 1] },
  { t: "Explica en lectura fácil", v: [0.5, 0.5, 0, 0, 1], nota: ["Solo una guía", "Con dibujos"] },
  { t: "Hace la cuenta antes de pagar", v: [0, 0.5, 0, 0, 1], nota: [undefined, "Presupuestos"] },
  { t: "Avisa de estafas sin bloquear", v: [0, 0, 0.5, 0, 1], nota: [undefined, undefined, "Bloquea"] },
  { t: "Persona de apoyo con permisos", v: [1, 1, 1, 0, 1] },
  { t: "Decide la persona, no el apoyo", v: [1, 0.5, 0, 1, 1], nota: [undefined, "Pone límites", "Decide el cuidador"] },
];

function Mark({ v, on }: { v: V; on: boolean }) {
  if (v === 1)
    return (
      <svg width="30" height="30" viewBox="0 0 48 48" role="img" aria-label="Sí">
        <circle cx="24" cy="24" r="24" fill={on ? CREMA : VERDE} />
        <path d="M14 24.5l7 7 13-14" stroke={on ? VERDE : CREMA} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (v === 0.5)
    return (
      <svg width="30" height="30" viewBox="0 0 48 48" role="img" aria-label="En parte">
        <circle cx="24" cy="24" r="22.5" fill="none" stroke={VERDE} strokeWidth="3" />
        <path d="M24 1.5a22.5 22.5 0 0 1 0 45z" fill={VERDE} />
      </svg>
    );
  return (
    <svg width="30" height="30" viewBox="0 0 48 48" role="img" aria-label="No">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="#CDD5C6" strokeWidth="3" />
      <path d="M16.5 16.5l15 15M31.5 16.5l-15 15" stroke="#8C9A7C" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function Competencia() {
  return (
    <section id="competencia" className="py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="06">La competencia</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Ya hay empresas aquí. Ninguna lo junta todo." />
        </h2>
      </Wrap>
      <Wrap className="mt-14">
        <Reveal>
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="w-[30%]" />
                  {COLS.map((c, i) => (
                    <th key={c.n} scope="col" className={`px-2 pb-4 pt-5 text-center align-bottom ${i === 4 ? "rounded-t-3xl bg-verde text-fondo" : ""}`}>
                      <span className="block text-lg font-bold">{c.n}</span>
                      <span className={`block text-sm font-normal ${i === 4 ? "text-salvia" : "text-suave"}`}>{c.c}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FILAS.map((f, r) => (
                  <motion.tr
                    key={f.t}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, ease: EASE, delay: r * 0.07 }}
                  >
                    <th scope="row" className={`rounded-l-2xl px-5 py-4 text-base font-bold sm:text-lg ${r % 2 ? "" : "bg-white"}`}>
                      {f.t}
                    </th>
                    {f.v.map((v, j) => (
                      <td
                        key={j}
                        className={`px-2 py-4 text-center ${j === 4 ? `bg-verde ${r === FILAS.length - 1 ? "rounded-b-3xl" : ""}` : r % 2 ? "" : "bg-white"}`}
                      >
                        <span className="inline-flex flex-col items-center gap-1">
                          <Mark v={v} on={j === 4} />
                          {f.nota?.[j] && <span className="text-xs text-suave">{f.nota[j]}</span>}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 07 · Demo ───────────────────────── */
export function Demo() {
  return (
    <section id="demo" className="overflow-hidden bg-noche py-28 text-crema lg:py-40">
      <Wrap className="grid items-center gap-16 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col gap-8">
          <Eyebrow n="07" dark>
            Demo · 3 minutos
          </Eyebrow>
          <h2 className={T_XL}>
            <Words text="Un capricho, una carta o un Bizum sospechoso." />
          </h2>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-crema px-7 py-4 text-lg font-bold text-noche transition-transform duration-300 hover:scale-[1.03]"
              >
                Abrir la demo
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
              <span className="font-semibold text-crema/70">willo-sfh4.onrender.com</span>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="max-w-2xl text-xl leading-snug text-crema/70 sm:text-2xl">
              Fíjate en una cosa: Noa explica, pero <span className="text-crema">los botones los pulsa Javi.</span>
            </p>
          </Reveal>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 6, y: 60 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 70, damping: 16 }}
          className="mx-auto w-[min(300px,70vw)]"
        >
          <Phone src="/screens/02-escucha.png" alt="Pantalla «Noa te escucha», con el botón del micrófono" className="bg-black" />
        </motion.div>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 08 · Momentos (scroll horizontal) ───────────────────────── */
const MOMENTOS = [
  { src: "/screens/03-respuesta.png", alt: "Noa hace la cuenta de la entrada: de 210 a 165 euros", w: "¿Me lo puedo comprar?", t: "¿Me lo puedo comprar?", d: "210 € → 165 €. Tú decides." },
  { src: "/screens/07-documento.png", alt: "Noa explica una multa de aparcamiento de 90 euros", w: "Noa lee tus documentos", t: "Noa lee tus documentos", d: "Javi confirma los datos. La foto no se guarda." },
  { src: "/screens/08-pausa.png", alt: "Pausa para pensar ante un Bizum de 300 euros a una persona nueva", w: "Pausa para pensar", t: "Pausa para pensar", d: "Explica por qué parece una estafa. No bloquea." },
];

export function Momentos() {
  const reduced = useReducedMotion();
  const [ref, p] = useProgress(["start start", "end end"], 0);
  const track = useRef<HTMLDivElement>(null);
  const dist = useRef(0);
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => (dist.current = Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const x = useTransform(p, (v) => -v * dist.current);

  return (
    <section id="momentos" ref={ref} className={reduced ? "py-28" : "relative h-[320vh]"}>
      <div className={reduced ? "overflow-x-auto" : "sticky top-0 flex h-svh items-center overflow-hidden pt-14"}>
        <motion.div ref={track} style={{ x }} className={`flex w-max items-center gap-6 sm:gap-10 ${PAD}`}>
          <div className="flex w-[min(80vw,460px)] shrink-0 flex-col gap-8">
            <Eyebrow n="08">Lo que hace Willo</Eyebrow>
            <h2 className={T_L}>Noa explica. Javi decide. Siempre.</h2>
            <p className="flex items-center gap-3 font-semibold text-suave">
              <span aria-hidden="true">→</span> Sigue bajando
            </p>
          </div>
          {MOMENTOS.map((m, i) => (
            <motion.div
              key={m.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}
              className="w-[min(82vw,520px)] shrink-0"
            >
              <Window title={m.w}>
                <div className="grid place-items-center bg-salvia px-8 py-8 sm:py-10">
                  <img src={m.src} alt={m.alt} loading="lazy" className="h-[min(46vh,440px)] w-auto rounded-2xl shadow-[0_24px_50px_-20px_rgba(14,20,13,0.5)]" />
                </div>
                <div className="flex items-start gap-4 p-6">
                  <span className="titular text-3xl font-semibold text-verde">{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-bold sm:text-2xl">{m.t}</h3>
                    <p className="mt-1 text-suave">{m.d}</p>
                  </div>
                </div>
              </Window>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── 09 · Círculo de apoyo ───────────────────────── */
export function Circulo() {
  const niveles = [
    { t: "Solo yo", d: "Nadie más ve el dinero de Javi." },
    { t: "Acompañar", d: "Ana ve los pagos, y Javi la llama con un toque si Noa ve algo raro.", ana: true },
    { t: "Medida judicial", d: "Solo si hay una sentencia. Hace lo que diga y genera el informe para el juez." },
  ];
  return (
    <section id="circulo" className="py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="09">El círculo de apoyo</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Willo avisa, Javi decide." />
        </h2>
        <Reveal>
          <p className="max-w-3xl text-xl leading-snug text-suave sm:text-2xl">Para Javi solo hay una pregunta: ¿quieres que alguien te acompañe con tu dinero?</p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-14 grid gap-12 lg:grid-cols-2">
        <ol className="flex flex-col gap-4">
          {niveles.map((n, i) => (
            <Reveal key={n.t} delay={i * 0.1}>
              <li
                className={`flex items-center gap-5 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 ${
                  n.ana ? "bg-verde text-fondo shadow-[0_30px_60px_-30px_rgba(62,90,52,0.8)]" : "bg-white"
                }`}
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl font-bold ${n.ana ? "bg-fondo text-verde" : "bg-salvia text-verde"}`}>{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-3 text-2xl font-bold">
                    {n.t}
                    {n.ana && <span className="rounded-full bg-fondo px-3 py-0.5 text-sm text-verde">Ana</span>}
                  </h3>
                  <p className={`mt-1 ${n.ana ? "text-salvia" : "text-suave"}`}>{n.d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="flex flex-col gap-4">
          <Reveal y={16}>
            <p className="text-lg font-bold text-verde">Si Noa ve algo raro, Javi elige:</p>
          </Reveal>
          {[
            { t: "Hablarlo con Ana", d: "Ana ve el pago y le ayuda a decidir." },
            { t: "Seguir él solo", d: "Ana no se entera. Noa le explica por qué parece un engaño y le propone esperar 10 minutos. Puede saltárselo." },
          ].map((o, i) => (
            <Reveal key={o.t} delay={0.15 + i * 0.1}>
              <div className="flex items-start gap-5 rounded-3xl border-2 border-salvia bg-white/60 p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-verde font-bold text-verde">{i ? "B" : "A"}</span>
                <div>
                  <h3 className="text-2xl font-bold">{o.t}</h3>
                  <p className="mt-1 text-suave">{o.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
      <Wrap className="mt-12">
        <p className="text-sm text-suave">El pago nunca se bloquea. Basado en la Ley 8/2021: apoyar a la persona, no sustituirla.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 10 · El móvil de Ana ───────────────────────── */
export function Ana() {
  const [ref, p] = useProgress(["start end", "end start"], 0.5);
  const y1 = useTransform(p, [0, 1], [80, -80]);
  const y2 = useTransform(p, [0, 1], [200, -140]);
  return (
    <section ref={ref} id="ana" className="relative overflow-hidden py-28 lg:py-40">
      <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-salvia lg:block" />
      <Wrap className="relative grid items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Eyebrow n="10">El móvil de Ana</Eyebrow>
          <h2 className={T_XL}>
            <Words text="Ana acompaña. No decide." />
          </h2>
          <ul className="flex flex-col gap-6">
            {[
              { t: "Solo ve lo que Javi comparte", d: "Sus pagos y sus decisiones, si él quiere." },
              { t: "Si Javi pide ayuda, Ana recibe un aviso", d: "Ve a quién quiere pagar, cuánto y por qué parece un engaño." },
              { t: "No puede bloquear pagos", d: "Puede llamar a Javi y hablarlo con él." },
            ].map((it, i) => (
              <Reveal key={it.t} delay={i * 0.1}>
                <li className="flex gap-4">
                  <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-verde" />
                  <div>
                    <p className="text-xl font-bold sm:text-2xl">{it.t}</p>
                    <p className="mt-1 text-lg text-suave">{it.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="flex justify-center gap-4 sm:gap-8">
          <motion.div style={{ y: y1 }} className="w-[min(240px,42vw)]">
            <Phone src="/screens/09-ana-aviso.png" alt="Móvil de Ana: aviso de posible estafa con el botón Llamar a Javi" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="w-[min(240px,42vw)]">
            <Phone src="/screens/11-ana-estafas.png" alt="Móvil de Ana: resumen de los avisos de estafa y lo que decidió Javi" />
          </motion.div>
        </div>
      </Wrap>
      <Wrap className="relative mt-24">
        <p className="text-sm text-suave">Pantallas reales de la demo, tras el Bizum de Carlos.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 11 · Cómo funciona ───────────────────────── */
export function Tecnologia() {
  const [ref, p] = useProgress(["start 0.75", "end 0.6"], 1);
  const line = useTransform(p, [0.1, 0.9], [0, 1]);
  const pasos = [
    { k: "ElevenLabs", t: "Noa escucha y habla", d: "La voz, la conversación y el dictado (Scribe).", c: "bg-white" },
    { k: "Nuestro código", t: "El código hace la cuenta", d: null, c: "bg-verde text-fondo" },
    { k: "Claude", t: "Lo explica en lectura fácil", d: "Y lee las fotos de multas y facturas.", c: "bg-white" },
    { k: "La persona", t: "Javi decide", d: "Willo nunca compra, nunca paga y nunca bloquea.", c: "bg-salvia" },
  ];
  return (
    <section ref={ref} id="tecnologia" className="py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="11">Cómo funciona</Eyebrow>
        <h2 className={T_XL}>
          <Words text="La IA explica. Las cuentas las hace nuestro código." />
        </h2>
      </Wrap>
      <Wrap className="relative mt-14">
        {/* Línea que se dibuja con el scroll y conecta los cuatro pasos. */}
        <div className="absolute left-[2.75rem] top-0 bottom-0 w-0.5 bg-salvia sm:left-[3.75rem] lg:inset-x-20 lg:top-1/2 lg:bottom-auto lg:h-0.5 lg:w-auto">
          <motion.div style={{ scaleY: line }} className="h-full w-full origin-top bg-verde lg:hidden" />
          <motion.div style={{ scaleX: line }} className="hidden h-full w-full origin-left bg-verde lg:block" />
        </div>
        <ol className="relative grid gap-6 lg:grid-cols-4">
          {pasos.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.12}>
              <li className={`flex h-full flex-col gap-3 rounded-3xl p-7 shadow-[0_24px_50px_-35px_rgba(14,20,13,0.5)] ${s.c}`}>
                <p className={`text-sm font-bold ${i === 1 ? "text-salvia" : i === 3 ? "text-verde" : "text-suave"}`}>{s.k}</p>
                <h3 className="text-2xl font-bold leading-tight">{s.t}</h3>
                <p className={i === 1 ? "text-salvia" : "text-suave"}>
                  {s.d ?? (
                    <>
                      210 € − 45 € = <Count from={210} to={165} suffix=" €" />. Sin IA.
                    </>
                  )}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Wrap>
      <Wrap className="mt-12">
        <Reveal>
          <p className="max-w-3xl text-lg text-suave">Se instala desde el navegador, sin tienda de apps. Se guardan los datos, nunca las fotos.</p>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 12 · Lectura fácil ───────────────────────── */
export function LecturaFacil() {
  const filas = [
    { t: "Carta falsa de la Seguridad Social", a: 22, b: 98 },
    { t: "Multa de aparcamiento", a: 44, b: 87 },
    { t: "Factura de la luz", a: 26, b: 100 },
  ];
  return (
    <section id="lectura-facil" className="bg-white/50 py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="12">Lectura fácil, medida</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Con Noa, papeles difíciles se vuelven fáciles de leer." />
        </h2>
        <Reveal>
          <p className="max-w-3xl text-xl leading-snug text-suave">
            Índice Fernández-Huerta: mide lo fácil que es leer un texto en español, de 0 a 100. <b className="text-verde">De 80 para arriba, es fácil.</b>
          </p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-16 flex flex-col gap-12">
        {filas.map((f, i) => (
          <div key={f.t} className="grid gap-3 lg:grid-cols-[18rem_1fr] lg:items-center lg:gap-10">
            <Reveal y={12} delay={i * 0.1}>
              <p className="text-lg font-bold">{f.t}</p>
            </Reveal>
            <div className="relative h-16">
              {/* Zona "fácil" (80-100) */}
              <div className="absolute inset-y-0 left-[80%] right-0 rounded-xl bg-salvia" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-salvia-media/50" />
              <motion.div
                className="absolute top-1/2 h-1.5 -translate-y-1/2 origin-left rounded-full bg-verde"
                style={{ left: `${f.a}%`, width: `${f.b - f.a}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.3 + i * 0.15 }}
              />
              <Dot pos={f.a} label={f.a} delay={0.2 + i * 0.15} />
              <Dot pos={f.b} label={f.b} delay={1.4 + i * 0.15} strong />
            </div>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-6 text-sm text-suave lg:ml-[20rem]">
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-salvia-media" /> El papel original</span>
          <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-verde" /> Lo que dice Noa</span>
          <span className="flex items-center gap-2"><i className="h-3 w-5 rounded bg-salvia" /> Fácil (80+)</span>
        </div>
        <p className="text-sm text-suave">En nuestros 3 ejemplos: papeles escritos por el equipo al estilo de los reales. Medido con nuestros scripts.</p>
      </Wrap>
    </section>
  );
}

function Dot({ pos, label, delay, strong = false }: { pos: number; label: number; delay: number; strong?: boolean }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos}%` }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
    >
      <span className={`block rounded-full ${strong ? "h-6 w-6 bg-verde ring-4 ring-fondo" : "h-4 w-4 bg-salvia-media"}`} />
      <span className={`absolute bottom-full left-1/2 mb-1 -translate-x-1/2 font-bold ${strong ? "titular text-2xl text-verde" : "text-sm text-suave"}`}>{label}</span>
    </motion.div>
  );
}

/* ───────────────────────── 13 · Modelo de negocio ───────────────────────── */
export function Negocio() {
  const partes = [
    { t: "Cuota base", d: "Plataforma, soporte y mantenimiento", p: "1.500 €", u: "al mes" },
    { t: "Por usuario activo", d: "Solo cuenta quien usa Willo ese mes", p: "2,40 €", u: "al mes", accent: true },
    { t: "Implantación", d: "Integración, marca y formación", p: "15.000 €", u: "una vez" },
  ];
  return (
    <section id="negocio" className="py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="13">Modelo de negocio · B2B2C · SaaS</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Paga el banco, porque la ley ya le pide ser accesible." />
        </h2>
      </Wrap>
      <Wrap className="mt-14 grid gap-16 lg:grid-cols-2">
        <div>
          <Reveal y={12}>
            <p className="pb-3 font-bold text-verde">Lo que paga el banco</p>
          </Reveal>
          {partes.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.1}>
              <div className="flex items-center justify-between gap-6 border-t border-salvia py-6">
                <div>
                  <p className={`text-xl font-bold sm:text-2xl ${it.accent ? "text-verde" : ""}`}>{it.t}</p>
                  <p className="text-suave">{it.d}</p>
                </div>
                <div className="text-right">
                  <p className={`titular whitespace-nowrap text-3xl font-semibold sm:text-4xl ${it.accent ? "text-verde" : ""}`}>{it.p}</p>
                  <p className="text-sm text-suave">{it.u}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="flex flex-col justify-center gap-4 rounded-[2rem] bg-salvia/60 p-8 sm:p-12">
          <p className="font-bold text-verde">Ejemplo: un banco con 13.816 usuarios</p>
          <p className="titular text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-none text-verde">
            <Count to={34658} suffix=" €" />
          </p>
          <p className="text-xl">al mes: 1.500 € de base + 13.816 × 2,40 €.</p>
          <p className="text-suave">La persona no paga nada. El banco paga según el uso real.</p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-12">
        <p className="text-sm text-suave">Precios sin IVA, pendientes de validar con bancos. Mismo modelo que FinCell y Crassula: alta + cuota base + uso.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 14 · Ingresos y costes ───────────────────────── */
export function Numeros() {
  const filas = [
    { t: "Ingresos sin IVA", d: "Base 1.500 € + 13.816 usuarios × 2,40 €", v: "34.658 €" },
    { t: "IA para conversar", d: "3 conversaciones al día · 0,0136 $ cada una", v: "− 15.117 €" },
    { t: "Mantenimiento", d: "30 horas al mes a 40 €/hora", v: "− 1.200 €" },
    { t: "Infraestructura", d: "Vercel y Render", v: "− 24 €" },
    { t: "Resultado operativo", d: "Lo que nos queda cada mes", v: "18.318 €", accent: true },
  ];
  const tramos = [
    { w: 43.6, c: "bg-salvia", l: "IA · 44 %" },
    { w: 3.5, c: "bg-salvia-media", l: "Mantenimiento e infraestructura · 3,5 %" },
    { w: 52.9, c: "bg-verde", l: "Resultado · 53 %" },
  ];
  return (
    <section id="numeros" className="bg-white/50 py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="14">Ingresos y costes · al mes</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Nos quedan 53 céntimos de cada euro." />
        </h2>
      </Wrap>
      <Wrap className="mt-14">
        <div className="flex h-12 overflow-hidden rounded-2xl sm:h-16" role="img" aria-label="De cada euro: 44 % IA, 3,5 % mantenimiento e infraestructura, 53 % resultado">
          {tramos.map((t, i) => (
            <motion.div
              key={t.l}
              className={`h-full origin-left ${t.c}`}
              style={{ width: `${t.w}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.35 }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1 text-sm font-bold text-suave sm:flex-row sm:justify-between">
          {tramos.map((t) => (
            <span key={t.l} className="flex items-center gap-2">
              <i className={`h-3 w-3 rounded-full ${t.c}`} />
              {t.l}
            </span>
          ))}
        </div>
      </Wrap>
      <Wrap className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          {filas.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.07}>
              <div className="flex items-baseline justify-between gap-6 border-t border-salvia py-4">
                <div>
                  <p className={`text-lg font-bold sm:text-xl ${f.accent ? "text-verde" : ""}`}>{f.t}</p>
                  <p className="text-sm text-suave">{f.d}</p>
                </div>
                <p className={`titular whitespace-nowrap text-2xl font-semibold sm:text-3xl ${f.accent ? "text-verde" : ""}`}>{f.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <Reveal delay={0.2} className="rounded-3xl bg-verde p-8 text-fondo">
            <p className="font-bold text-salvia">Margen operativo</p>
            <p className="titular mt-2 text-7xl font-semibold leading-none">
              <Count to={53} suffix=" %" />
            </p>
          </Reveal>
          <Reveal delay={0.3} className="rounded-3xl bg-salvia p-8">
            <p className="font-bold text-verde">Cada usuario nuevo nos deja</p>
            <p className="titular mt-2 text-5xl font-semibold leading-none text-verde">
              <Count to={1.31} decimals={2} prefix="+ " suffix=" € al mes" />
            </p>
          </Reveal>
        </div>
      </Wrap>
      <Wrap className="mt-12">
        <p className="text-sm text-suave">Estimación del equipo, sin datos reales. Precios pendientes de validar con bancos. IA: 1 $ ≈ 0,89 €.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 15 · Go to market ───────────────────────── */
export function GoToMarket() {
  const pasos = [
    { k: "Paso 1 · Validar", t: "Con las asociaciones", d: "AMÁS ya ha validado Willo y quiere colaborar para que personas con discapacidad intelectual prueben la demo.", c: "bg-white", s: "text-suave" },
    { k: "Paso 2 · Piloto", t: "Con un banco", d: "Willo va dentro de la app del banco. Esa pantalla ya está hecha.", c: "bg-verde text-fondo", s: "text-salvia" },
    { k: "Paso 3 · Crecer", t: "Más bancos y Europa", d: "La ley viene de una directiva europea: toda la UE tiene la misma obligación.", c: "bg-salvia", s: "text-verde" },
  ];
  const metricas = [
    { k: "Implantación", v: "15.000 €", d: "una vez, por banco" },
    { k: "Cuota base", v: "1.500 €", d: "al mes, por banco" },
    { k: "Por usuario", v: "2,40 €", d: "al mes, por usuario" },
    { k: "Captar usuarios", v: "≈ 0 €", d: "entramos por las asociaciones" },
  ];
  return (
    <section id="go-to-market" className="py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="15">Go to market</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Entramos por las asociaciones. Vendemos a los bancos." />
        </h2>
      </Wrap>
      <Wrap className="mt-14 grid gap-5 lg:grid-cols-3">
        {pasos.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 60, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: EASE, delay: i * 0.15 }}
            className={`flex flex-col gap-3 rounded-3xl p-8 ${s.c}`}
          >
            <p className={`text-sm font-bold ${s.s}`}>{s.k}</p>
            <h3 className="text-2xl font-bold sm:text-3xl">{s.t}</h3>
            <p className={s.s}>{s.d}</p>
          </motion.div>
        ))}
      </Wrap>
      <Wrap className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <Reveal className="flex flex-col justify-center gap-2 rounded-3xl border-2 border-verde p-7 sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-bold text-verde">Nuestro canal</p>
          <p className="titular text-3xl font-semibold leading-tight">
            950 asociaciones
            <br />
            150.000 personas
          </p>
          <p className="text-suave">Las que agrupa Plena inclusión en España.</p>
        </Reveal>
        {metricas.map((m, i) => (
          <Reveal key={m.k} delay={0.1 + i * 0.08} className="flex flex-col justify-center gap-1 rounded-3xl bg-white p-6">
            <p className="text-sm font-bold text-suave">{m.k}</p>
            <p className="titular whitespace-nowrap text-3xl font-semibold text-verde">{m.v}</p>
            <p className="text-sm text-suave">{m.d}</p>
          </Reveal>
        ))}
      </Wrap>
      <Wrap className="mt-12">
        <p className="text-sm text-suave">Precios: propuesta del equipo, pendiente de validar con bancos. Fuentes: Plena inclusión España; Directiva (UE) 2019/882.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 16 · Equipo ───────────────────────── */
export function Equipo() {
  const equipo = [
    { n: "Inés", r: "Ingeniera de Datos", f: "ines" },
    { n: "Jiawen", r: "Analista de Datos", f: "jiawen" },
    { n: "He", r: "Informática y ADE", f: "he" },
    { n: "Nolan", r: "Empresa y Tecnología", f: "nolan" },
    { n: "Xingyi", r: "Telecomunicación", f: "xingyi" },
    { n: "Anqi", r: "Economía", f: "anqi" },
  ];
  return (
    <section id="equipo" className="py-28 lg:py-40">
      <Wrap className="flex flex-col gap-8">
        <Eyebrow n="16">El equipo · ChickPEAKS</Eyebrow>
        <h2 className={T_XL}>
          <Words text="Somos seis, y nos complementamos." />
        </h2>
      </Wrap>
      <Wrap className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {equipo.map((p, i) => (
          <Reveal key={p.n} delay={(i % 3) * 0.1}>
            <div className="group flex items-center justify-between gap-6 border-t border-salvia pt-6">
              <div>
                <h3 className="text-3xl font-bold">{p.n}</h3>
                <p className="mt-1 text-lg text-suave">{p.r}</p>
              </div>
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full sm:h-28 sm:w-28">
                <img
                  src={`/equipo/${p.f}.jpg`}
                  alt={`Foto de ${p.n}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </Wrap>
    </section>
  );
}

/* ───────────────────────── 17 · Pruébalo ───────────────────────── */
export function Pruebalo() {
  return (
    <section id="pruebalo" className="relative overflow-hidden py-28 lg:py-40">
      <div className="absolute inset-y-0 right-0 hidden w-[44%] bg-salvia lg:block" />
      <Wrap className="relative grid items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Eyebrow n="17">Pruébalo</Eyebrow>
          <h2 className={T_XL}>
            <Words text="¡No olvides probarnos!" />
          </h2>
          <Reveal>
            <p className="max-w-xl text-xl leading-snug text-suave sm:text-2xl">Escanea el código con el móvil y prueba la demo de Willo. Sin instalar nada.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-verde underline decoration-2 underline-offset-8 hover:decoration-4">
              willo-sfh4.onrender.com
            </a>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="flex flex-wrap items-center gap-4 text-suave">
              Patrocina el hackathon
              <img src="/myinvestor.svg" alt="" className="h-8 w-auto" />
              <span className="text-2xl font-bold text-[#282828]">MyInvestor</span>
            </p>
          </Reveal>
        </div>
        <motion.a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.04, rotate: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          className="mx-auto block rounded-[2.5rem] bg-white p-8 shadow-[0_40px_80px_-30px_rgba(14,20,13,0.35)] sm:p-10"
        >
          <img src="/qr-willo.svg" alt="Código QR que lleva a la demo de Willo: willo-sfh4.onrender.com" className="h-[min(60vw,320px)] w-[min(60vw,320px)]" />
        </motion.a>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Cierre ───────────────────────── */
export function Cierre() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const small = typeof window !== "undefined" && window.innerWidth < 640;
  return (
    <section ref={ref} id="cierre" className="relative h-svh min-h-[640px] overflow-hidden bg-noche text-crema">
      <ParticleText
        renderer="canvas"
        text="willo"
        color={CREMA}
        active={inView}
        fitWidth={0.75}
        fitHeight={0.3}
        centerY={0.34}
        maxPoints={small ? 1100 : 3500}
        dotSize={small ? 1.4 : 2}
      />
      <div className="absolute inset-x-5 top-[56%] flex flex-col items-center gap-5 text-center">
        <p className="titular text-[clamp(2.2rem,6vw,5rem)] font-semibold italic leading-[1.05]">
          <Words text="Tu voluntad, tu dinero." delay={0.8} />
        </p>
        <p className="text-lg text-crema/75 sm:text-2xl">
          <Words text="Nunca compra. Nunca paga. Nunca bloquea." delay={1.2} />
        </p>
        <p className="max-w-2xl text-base font-semibold text-salvia sm:text-xl">
          <Words text="Nuestro objetivo: contactos en bancos y mentoría para el piloto." delay={1.6} />
        </p>
      </div>
      <p className="absolute inset-x-0 bottom-8 text-center text-sm text-crema/60">Willo · Equipo ChickPEAKS · Demo con datos inventados</p>
    </section>
  );
}
