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
import ParticleText from "./components/ParticleText";
import { Count, EASE, LEAD, Phone, Reveal, T_L, T_XL, Words } from "./components/ui";

export const DEMO_URL = "https://willo-sfh4.onrender.com/demo/banco";
const VERDE = "#3E5A34";
const CREMA = "#F5F7F0";
const NUBE = ["#3E5A34", "#3E5A34", "#3E5A34", "#3E5A34", "#2E4527", "#A3B18F", "#A3B18F", "#E9A23B", "#E0735A", "#9CC3E0"];
const NUBE_NOCHE = ["#F5F7F0", "#F5F7F0", "#F5F7F0", "#D3DFC8", "#A3B18F", "#E9A23B", "#E0735A", "#9CC3E0"];

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

export const PAD = "px-5 sm:px-10 lg:px-16";
export const Wrap = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[90rem] ${PAD} ${className}`}>{children}</div>
);

const BTN = "inline-flex items-center gap-3 rounded-full px-7 py-4 text-lg font-bold transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

function DemoLink({ children = "Probar la demo", dark = false }: { children?: ReactNode; dark?: boolean }) {
  return (
    <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className={`${BTN} group ${dark ? "bg-crema text-noche hover:bg-salvia" : "bg-verde text-crema hover:bg-texto"}`}>
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
    </a>
  );
}

/* ───────────────────────── Portada ───────────────────────── */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const small = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <section ref={ref} id="inicio" className="relative flex min-h-svh flex-col pt-16">
      {/* La palabra "willo" hecha de puntos: se dispersa con el ratón y vuelve a su sitio. */}
      <motion.div style={{ scale, opacity: fade }} className="relative min-h-[38vh] flex-1">
        {/* shortcut: el ancho se mide solo al cargar; en móvil, menos puntos para que no se amontonen. */}
        <ParticleText renderer="canvas" text="willo" colors={NUBE} active={inView} fitWidth={0.86} fitHeight={0.7} centerY={0.5} gap={2} maxPoints={small ? 2600 : 9500} dotSize={small ? 1.1 : 1.55} />
      </motion.div>
      <Wrap className="grid gap-8 pb-12 pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16 lg:pb-16">
        <h1 className="titular text-[clamp(2.8rem,6.6vw,6.2rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-texto">
          <span className="sr-only">Willo: </span>
          <Words text="Tu voluntad, tu dinero." delay={0.9} />
        </h1>
        <Reveal delay={1.3} y={16} className="flex flex-col gap-7">
          <p className="max-w-xl text-xl leading-[1.45] sm:text-2xl">
            Willo es el modo fácil de tu banco: una app de dinero que se usa hablando y en lectura fácil, para personas con discapacidad intelectual.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <DemoLink />
            <a href="#como-funciona" className="text-lg font-bold text-verde underline decoration-2 underline-offset-[6px] transition-[text-decoration-thickness] hover:decoration-4">
              Ver cómo funciona
            </a>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Para quién: Javi + el problema ───────────────────────── */
export function ParaQuien() {
  const [ref, p] = useProgress(["start end", "end start"], 0.5);
  const y = useTransform(p, [0, 1], [80, -80]);
  const rotate = useTransform(p, [0.1, 0.5], [-6, 0]);

  return (
    <section ref={ref} id="para-quien" className="relative overflow-hidden bg-salvia py-28 lg:py-44">
      <Wrap className="grid items-center gap-16 lg:grid-cols-[1fr_0.8fr_0.9fr]">
        <div className="flex flex-col gap-8">
          <h2 className={T_XL}>
            <Words text="Hecho para Javi." />
          </h2>
          <Reveal>
            <p className={LEAD}>Tiene 34 años, trabaja en una lavandería y cobra 980 € al mes. Quiere decidir sobre su dinero, como cualquiera.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[34rem] text-lg leading-relaxed">
              Pero la app de su banco usa palabras técnicas y mucho texto. Así que pregunta a su familia para todo, o se arriesga a que le engañen. Ana, su hermana, le ayuda, pero no quiere decidir por él: quiere acompañarle.
            </p>
          </Reveal>
        </div>
        <motion.div style={{ y, rotate }} className="mx-auto w-[min(290px,68vw)]">
          <Phone src="/screens/01-inicio.png" alt="Pantalla de inicio de Javi en Willo: le quedan 210 euros hasta el día 30" />
        </motion.div>
        <Reveal delay={0.15} className="flex flex-col gap-8 rounded-[2rem] bg-fondo p-8 sm:p-10">
          <p className="titular text-[clamp(3.6rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-verde">1 de cada 3</p>
          <p className="text-xl leading-snug">personas con discapacidad intelectual usa internet a menudo. En la población general, el 84 %.</p>
          <div className="flex flex-col gap-4">
            <Bar label="Con discapacidad intelectual" value="33 %" to={0.33} strong />
            <Bar label="Población general" value="84 %" to={0.84} />
          </div>
          <p className="text-base text-suave">Fuente: INE, datos de 2022, citados por Plena inclusión.</p>
        </Reveal>
      </Wrap>
    </section>
  );
}

function Bar({ label, value, to, strong = false }: { label: string; value: string; to: number; strong?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <p className="font-bold">{label}</p>
        <p className={`titular text-2xl font-semibold ${strong ? "text-verde" : "text-suave"}`}>{value}</p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-salvia">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: to }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: EASE, delay: strong ? 0.2 : 0.45 }}
          className={`h-full origin-left rounded-full ${strong ? "bg-verde" : "bg-salvia-media"}`}
        />
      </div>
    </div>
  );
}

/* Franja de la ley: la oportunidad. */
export function Ley() {
  return (
    <section aria-labelledby="ley-t" className="bg-miel py-20 text-noche lg:py-28">
      <Wrap className="grid items-end gap-8 lg:grid-cols-[auto_1fr] lg:gap-20">
        <h2 id="ley-t" className="titular text-[clamp(3.4rem,9vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.03em]">
          <Words text="Junio de 2025." />
        </h2>
        <Reveal>
          <p className="max-w-xl text-xl leading-[1.45] sm:text-2xl">
            Desde entonces, la ley obliga a los bancos a ser accesibles. La banca digital dejaba fuera justo a quien más apoyo necesita. Ahora tiene que contar con ellos.
          </p>
        </Reveal>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Cómo funciona ───────────────────────── */
export function TuDecides() {
  const [ref, p] = useProgress<HTMLDivElement>(["start end", "end end"], 1);
  // Zoom: "Tú decides." crece mientras el fondo pasa de crema a verde.
  const scale = useTransform(p, [0, 0.85], [0.5, 1]);
  const bg = useTransform(p, [0.3, 0.8], [CREMA, VERDE]);
  const color = useTransform(p, [0.3, 0.8], [VERDE, CREMA]);

  return (
    <section id="como-funciona" aria-labelledby="como-t">
      <Wrap className="grid gap-10 pb-10 pt-28 lg:grid-cols-2 lg:items-end lg:pt-44">
        <h2 id="como-t" className={T_XL}>
          <Words text="Noa hace la cuenta." />
        </h2>
        <Reveal>
          <p className={LEAD}>Javi habla con Noa, su asistente. Noa suma, resta y lo explica con frases cortas y cifras en euros. Pero la última palabra nunca es suya. Siempre termina igual:</p>
        </Reveal>
      </Wrap>
      <motion.div ref={ref} style={{ backgroundColor: bg }} className="relative h-[170vh]">
        <div className="sticky top-0 grid h-svh place-items-center overflow-hidden">
          <motion.p style={{ scale, color }} className="titular text-[clamp(4.5rem,17vw,17rem)] font-semibold leading-none tracking-[-0.04em]">
            Tú decides.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

/* Lo que se puede probar en la página: la cuenta de Noa antes de comprar. */
const COSAS = [
  { t: "Entrada de concierto", p: 45 },
  { t: "Cena con amigos", p: 25 },
  { t: "Zapatillas", p: 60 },
  { t: "Móvil nuevo", p: 250 },
];
const SALDO = 210;
const euros = (n: number) => `${n.toLocaleString("es-ES")} €`;

export function Probar() {
  const [sel, setSel] = useState(0);
  const [eleccion, setEleccion] = useState<null | "si" | "no">(null);
  const c = COSAS[sel];
  const queda = SALDO - c.p;
  const llega = queda >= 0;

  const respuesta = !llega
    ? `No te llega: te faltan ${euros(-queda)}. Si quieres, podemos ahorrar un poco cada mes.`
    : eleccion === "si"
      ? `Hecho. Te quedan ${euros(queda)} hasta el día 30.`
      : eleccion === "no"
        ? `Bien. Sigues con ${euros(SALDO)}. Lo miramos otro día si quieres.`
        : null;

  return (
    <section id="probar" aria-labelledby="probar-t" className="py-28 lg:py-44">
      <Wrap className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="flex flex-col gap-8">
          <h2 id="probar-t" className={T_L}>
            ¿Me lo puedo comprar?
          </h2>
          <p className={LEAD}>Es lo que más le pregunta Javi a Noa. Elige algo y mira cómo responde.</p>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Qué quiere comprar Javi">
            {COSAS.map((x, i) => (
              <button
                key={x.t}
                type="button"
                aria-pressed={i === sel}
                onClick={() => {
                  setSel(i);
                  setEleccion(null);
                }}
                className={`rounded-full px-5 py-3 text-lg font-bold transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 active:scale-[0.97] ${
                  i === sel ? "bg-verde text-crema" : "bg-salvia text-texto hover:bg-salvia-media"
                }`}
              >
                {x.t} · {euros(x.p)}
              </button>
            ))}
          </div>
        </div>

        {/* La conversación, dibujada como en la app. */}
        <div data-ui className="mx-auto w-full max-w-xl rounded-[2rem] bg-cielo p-5 sm:p-8">
          <div className="flex items-center justify-between rounded-2xl bg-fondo px-5 py-4">
            <p className="font-bold">Este mes te quedan</p>
            <p className="titular text-3xl font-semibold text-verde">{euros(SALDO)}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3" aria-live="polite">
            <p className="self-end rounded-2xl rounded-br-md bg-verde px-5 py-3 text-lg font-semibold text-crema">¿Me puedo comprar {c.t.toLowerCase()}?</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={c.t}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex max-w-[92%] flex-col gap-3 rounded-2xl rounded-bl-md bg-fondo px-5 py-4 text-lg leading-snug"
              >
                <p className="font-bold text-verde">Noa</p>
                {llega ? (
                  <>
                    <p>
                      Ahora tienes {euros(SALDO)}. Cuesta {euros(c.p)}.
                    </p>
                    <p className="titular text-3xl font-semibold">
                      {euros(SALDO)} − {euros(c.p)} = <span className="text-verde">{euros(queda)}</span>
                    </p>
                    <p className="font-bold">Tú decides.</p>
                  </>
                ) : (
                  <p>
                    Cuesta {euros(c.p)} y tienes {euros(SALDO)}.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
            {llega && !eleccion && (
              <div className="mt-1 flex flex-wrap justify-end gap-3">
                <button type="button" onClick={() => setEleccion("si")} className="rounded-full bg-verde px-5 py-3 font-bold text-crema transition-transform hover:-translate-y-0.5 active:scale-[0.97]">
                  Lo compro
                </button>
                <button type="button" onClick={() => setEleccion("no")} className="rounded-full bg-fondo px-5 py-3 font-bold text-verde transition-transform hover:-translate-y-0.5 active:scale-[0.97]">
                  Mejor espero
                </button>
              </div>
            )}
            {respuesta && (
              <motion.p
                key={respuesta}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="max-w-[92%] rounded-2xl rounded-bl-md bg-fondo px-5 py-4 text-lg"
              >
                {respuesta}
              </motion.p>
            )}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* Tres momentos de la demo, en una pista que avanza en horizontal con el scroll (escritorio). */
const MOMENTOS = [
  { src: "/screens/03-respuesta.png", alt: "Noa hace la cuenta de la entrada: de 210 a 165 euros", t: "Antes de pagar, la cuenta", d: "210 € − 45 € = 165 €. Noa lo dice en voz alta y Javi elige." },
  { src: "/screens/07-documento.png", alt: "Noa explica una multa de aparcamiento de 90 euros", t: "Lee cartas y multas", d: "Javi hace una foto, confirma los datos y Noa se lo explica. La foto no se guarda." },
  { src: "/screens/08-pausa.png", alt: "Pausa para pensar ante un Bizum de 300 euros a una persona nueva", t: "Una pausa ante un Bizum raro", d: "Explica por qué parece una estafa. No bloquea nada: decide Javi." },
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

  // En móvil, o con movimiento reducido, las tarjetas se apilan: sin pista horizontal.
  const pista = !reduced;
  return (
    <section id="momentos" aria-labelledby="momentos-t" ref={ref} className={`bg-noche text-crema ${pista ? "relative py-28 lg:h-[300vh] lg:py-0" : "py-28"}`}>
      <div className={pista ? "lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden" : ""}>
        <motion.div ref={track} style={pista ? { x } : undefined} className={`flex flex-col gap-16 max-lg:!transform-none lg:w-max lg:flex-row lg:items-center lg:gap-20 ${PAD}`}>
          <div className="flex shrink-0 flex-col gap-6 lg:w-[28rem]">
            <h2 id="momentos-t" className={T_L}>
              Así le ayuda Noa
            </h2>
            <p className="text-xl leading-[1.45] text-crema">Tres momentos de la demo, con las pantallas reales de la app.</p>
          </div>
          {MOMENTOS.map((m, i) => (
            <motion.article
              key={m.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
              className="grid shrink-0 items-center gap-8 sm:grid-cols-[auto_1fr] lg:w-[44rem]"
            >
              <div className="mx-auto w-[min(250px,64vw)] lg:w-[min(270px,32vh)]">
                <Phone src={m.src} alt={m.alt} className="bg-black" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="titular text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[1.05]">{m.t}</h3>
                <p className="text-xl leading-[1.45] text-crema">{m.d}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* Por dentro: quién hace qué. */
export function Tecnologia() {
  const pasos = [
    { k: "ElevenLabs", t: "Escucha y habla", d: "La voz de Noa, la conversación y el dictado con Scribe.", c: "bg-fondo" },
    { k: "Nuestro backend, en FastAPI", t: "Hace las cuentas", d: null, c: "bg-verde text-crema" },
    { k: "Claude", t: "Lo dice fácil", d: "Lee multas y facturas y lo escribe en lectura fácil.", c: "bg-coral text-noche" },
    { k: "Javi", t: "Decide", d: "Willo nunca compra, nunca paga y nunca bloquea.", c: "bg-miel text-noche" },
  ];
  return (
    <section id="tecnologia" aria-labelledby="tec-t" className="bg-salvia py-28 lg:py-44">
      <Wrap className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <h2 id="tec-t" className={T_XL}>
          <Words text="La IA no hace cuentas." />
        </h2>
        <Reveal>
          <p className={LEAD}>Las cuentas y las reglas antiestafa están en nuestro código. La IA solo escucha y explica. Es una web app: se abre en el móvil sin pasar por la tienda de apps.</p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-16">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((s, i) => (
            <motion.li
              key={s.k}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.09 }}
              className={`flex min-h-[17rem] flex-col justify-between gap-6 rounded-[2rem] p-8 ${s.c}`}
            >
              <h3 className="titular text-[2.4rem] font-semibold leading-none">{s.t}</h3>
              <div>
                <p className="mt-3 text-lg leading-snug">
                  {s.d ?? (
                    <>
                      210 € − 45 € = <Count from={210} to={165} suffix=" €" />. Sin IA.
                    </>
                  )}
                </p>
                <p className="mt-4 text-lg font-bold">{s.k}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="mt-8 text-lg">Se guardan los datos, nunca las fotos.</p>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Lectura fácil, medida ───────────────────────── */
export function LecturaFacil() {
  const filas = [
    { t: "Carta falsa de la Seguridad Social", a: 22, b: 98 },
    { t: "Multa de aparcamiento", a: 44, b: 87 },
    { t: "Factura de la luz", a: 26, b: 100 },
  ];
  return (
    <section id="lectura-facil" aria-labelledby="lf-t" className="py-28 lg:py-44">
      <Wrap className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="flex flex-col gap-8">
          <h2 id="lf-t" className={T_L}>
            <Words text="Fácil de leer, y medido." />
          </h2>
          <Reveal>
            <p className="text-xl leading-[1.45]">
              El índice Fernández-Huerta mide lo fácil que es leer un texto en español, de 0 a 100. <b className="text-verde">De 80 para arriba, es fácil.</b> Así cambian tres papeles cuando los explica Noa.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-full bg-coral" /> El papel original
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-full bg-verde" /> Con Noa
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {filas.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.08} className="rounded-[2rem] bg-salvia/60 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-bold sm:text-2xl">{f.t}</h3>
                <p className="titular whitespace-nowrap text-2xl font-semibold text-verde sm:text-3xl">
                  {f.a} → {f.b}
                </p>
              </div>
              <div className="relative mt-8 h-8">
                {/* Zona "fácil" (80-100) */}
                <div className="absolute inset-y-0 left-[80%] right-0 rounded-lg bg-salvia-media/50" />
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-fondo" />
                <motion.div
                  className="absolute top-1/2 h-2 -translate-y-1/2 origin-left rounded-full bg-verde"
                  style={{ left: `${f.a}%`, width: `${f.b - f.a}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.3 + i * 0.12 }}
                />
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral" style={{ left: `${f.a}%` }} />
                <motion.span
                  className="absolute top-1/2 -ml-3 -mt-3 h-6 w-6 rounded-full bg-verde ring-4 ring-fondo"
                  style={{ left: `${f.b}%` }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.3 + i * 0.12 }}
                />
              </div>
            </Reveal>
          ))}
          <p className="mt-2 text-base text-suave">Papeles escritos por el equipo al estilo de los reales. Medido con nuestros scripts.</p>
        </div>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Familias: círculo de apoyo + móvil de Ana ───────────────────────── */
const NIVELES = [
  { t: "Solo yo", d: "Nadie más ve el dinero de Javi.", img: "/screens/01-inicio.png", alt: "Willo de Javi, sin nadie más en su círculo" },
  { t: "Acompañar", d: "Ana ve los pagos que Javi comparte. Si Noa ve algo raro, Javi la llama con un toque.", img: "/screens/09-ana-aviso.png", alt: "Móvil de Ana: aviso de posible estafa con el botón Llamar a Javi" },
  { t: "Medida judicial", d: "Solo aparece si hay una sentencia. Hace lo que diga y genera el informe para el juez.", img: "/screens/10-informe.png", alt: "Informe anual de Willo con los avisos y lo que decidió Javi" },
];

export function Familias() {
  const [n, setN] = useState(1);
  const nivel = NIVELES[n];
  return (
    <section id="familias" aria-labelledby="fam-t" className="relative overflow-hidden py-28 lg:py-44">
      <Wrap className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <h2 id="fam-t" className={T_XL}>
          <Words text="Acompañar sin decidir." />
        </h2>
        <Reveal>
          <p className={LEAD}>En vez de un control parental, Willo tiene un círculo de apoyo. Para Javi solo hay una pregunta: ¿quieres que alguien te acompañe con tu dinero?</p>
        </Reveal>
      </Wrap>

      <Wrap className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
        <div className="flex flex-col gap-3" role="group" aria-label="Niveles del círculo de apoyo">
          {NIVELES.map((x, i) => (
            <button
              key={x.t}
              type="button"
              aria-pressed={i === n}
              onClick={() => setN(i)}
              className={`rounded-[1.6rem] p-6 text-left transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 ${i === n ? "bg-verde text-crema" : "bg-salvia/60 hover:bg-salvia"}`}
            >
              <span className="titular block text-3xl font-semibold">{x.t}</span>
              <span className="mt-2 block text-lg leading-snug">{x.d}</span>
            </button>
          ))}
        </div>
        <div className="mx-auto w-[min(280px,68vw)]">
          <AnimatePresence mode="wait">
            <motion.div key={nivel.img} initial={{ opacity: 0, y: 24, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -16, rotate: -2 }} transition={{ duration: 0.5, ease: EASE }}>
              <Phone src={nivel.img} alt={nivel.alt} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-8">
          <h3 className="titular text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[1.05]">El móvil de Ana</h3>
          <ul className="flex flex-col gap-5 text-lg leading-snug">
            <li>
              <b>Solo ve lo que Javi comparte,</b> en la app Willo Apoyo.
            </li>
            <li>
              <b>Si Javi pide ayuda, le llega un aviso:</b> a quién quiere pagar, cuánto y por qué parece un engaño.
            </li>
            <li>
              <b>No tiene botón para bloquear.</b> Puede llamar a Javi y hablarlo.
            </li>
            <li>
              <b>Si Javi sigue solo,</b> Ana no se entera. Noa le propone esperar 10 minutos, y puede saltárselo.
            </li>
          </ul>
          <p className="text-base text-suave">El pago nunca se bloquea. Basado en la Ley 8/2021: apoyar a la persona, no sustituirla.</p>
        </div>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Bancos ───────────────────────── */
export function Bancos() {
  return (
    <section id="bancos" aria-labelledby="bancos-t" className="bg-verde pb-12 pt-28 text-crema lg:pt-44">
      <Wrap className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <h2 id="bancos-t" className={T_XL}>
          <Words text="Para bancos." />
        </h2>
        <Reveal>
          <p className={`${LEAD} text-crema`}>
            Willo va dentro de la app del banco, con su marca, como un botón más: el modo fácil. El banco se lo da gratis a sus clientes y cumple la Ley 11/2023 de accesibilidad.
          </p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          { v: "15.000 €", d: "Implantación, una vez: integración, marca y formación." },
          { v: "1.500 €", d: "Cuota base al mes: plataforma, soporte y mantenimiento." },
          { v: "2,40 €", d: "Al mes por usuario activo. Solo cuenta quien lo usa." },
        ].map((x, i) => (
          <Reveal key={x.v} delay={i * 0.08} className="flex flex-col gap-4 rounded-[2rem] bg-crema/10 p-8">
            <p className="titular text-[clamp(2.8rem,4.5vw,4.2rem)] font-semibold leading-none">{x.v}</p>
            <p className="text-lg leading-snug text-crema">{x.d}</p>
          </Reveal>
        ))}
      </Wrap>
      <Wrap className="mt-6">
        <p className="text-base text-salvia">Precios sin IVA, pendientes de validar con bancos. Mismo modelo que FinCell y Crassula: alta, cuota base y uso.</p>
      </Wrap>
    </section>
  );
}

/* El mercado: zoom de Europa a España y a las asociaciones. */
const MERCADO = [
  { k: "Europa", n: "≈ 7 millones", d: "personas con discapacidad intelectual. La directiva europea obliga a todos los bancos de la UE.", e: "≈ 200 M€ al año" },
  { k: "España", n: "157.895", d: "personas con discapacidad intelectual o del desarrollo reconocida.", e: "≈ 4,5 M€ al año" },
  { k: "Asociaciones", n: "13.816", d: "personas: 1 de cada 10 de las que ya apoya Plena inclusión. Es donde empezamos.", e: "≈ 416.000 € al año" },
];

export function Mercado() {
  const [ref, p] = useProgress<HTMLDivElement>(["start start", "end end"], 0.1);
  const scale = useTransform(p, [0, 0.3, 0.62, 0.95], [0.92, 1, 1.55, 2.55]);
  const [step, setStep] = useState(0);
  useMotionValueEvent(p, "change", (v) => setStep(v < 0.33 ? 0 : v < 0.66 ? 1 : 2));
  const r = MERCADO[step];

  return (
    <section id="mercado" aria-labelledby="mercado-t" className="bg-verde text-crema">
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16">
          <Wrap className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 flex min-h-[19rem] flex-col gap-5 lg:order-1">
              <h2 id="mercado-t" className="titular text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[1.05]">
                A quién llegamos
              </h2>
              <AnimatePresence mode="wait">
                <motion.div key={r.k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45, ease: EASE }} className="flex flex-col gap-3">
                  <p className="text-xl font-bold text-salvia">{r.k}</p>
                  <p className="titular text-[clamp(3.4rem,7.5vw,7rem)] font-semibold leading-[0.9] tracking-[-0.03em]">{r.n}</p>
                  <p className="max-w-lg text-xl leading-snug">{r.d}</p>
                  <p className="text-xl font-bold">{r.e}</p>
                </motion.div>
              </AnimatePresence>
              <p className="mt-2 text-base text-salvia">Fuentes: European Psychiatry (2020), IMSERSO (2024), Plena inclusión. Asociaciones: hipótesis del equipo, a 2,40 € por usuario.</p>
            </div>
            {/* Ventana que recorta el zoom: los círculos crecen dentro sin tapar el texto. */}
            <div className="relative order-1 mx-auto grid aspect-square w-[min(80vw,40vh,600px)] place-items-center overflow-hidden rounded-[2.4rem] bg-noche lg:order-2 lg:w-[min(42vw,72vh,620px)]">
              <motion.div style={{ scale }} className="relative aspect-square w-[88%]">
                <Ring size="100%" className="bg-salvia/25 text-crema" label="Europa" active={step === 0} />
                <Ring size="66%" className="bg-salvia-media/60 text-crema" label="España" active={step === 1} />
                <Ring size="33%" className="bg-crema text-verde" label="Asociaciones" active={step === 2} center />
              </motion.div>
            </div>
          </Wrap>
        </div>
      </div>
    </section>
  );
}

function Ring({ size, className, label, active, center = false }: { size: string; className: string; label: string; active: boolean; center?: boolean }) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-center rounded-full ${center ? "items-center" : "items-start pt-[5%]"} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className={`text-[clamp(0.85rem,1.9vmin,1.1rem)] font-bold transition-opacity duration-500 ${active ? "opacity-100" : "opacity-50"}`}>{label}</span>
    </div>
  );
}

/* Las cuentas: ingresos y costes al mes. */
export function Numeros() {
  const filas = [
    { t: "Ingresos", d: "1.500 € de base + 13.816 usuarios × 2,40 €", v: "34.658 €" },
    { t: "IA para conversar", d: "3 conversaciones al día, a poco más de 1 céntimo", v: "− 15.117 €" },
    { t: "Mantenimiento", d: "30 horas al mes a 40 € la hora", v: "− 1.200 €" },
    { t: "Alojamiento", d: "Vercel y Render", v: "− 24 €" },
  ];
  const tramos = [
    { w: 43.6, c: "bg-coral", l: "IA, 44 %" },
    { w: 3.5, c: "bg-miel", l: "Resto, 3,5 %" },
    { w: 52.9, c: "bg-verde", l: "Nos queda, 53 %" },
  ];
  return (
    <section id="numeros" aria-labelledby="num-t" className="py-28 lg:py-44">
      <Wrap className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div className="flex flex-col gap-10">
          <h2 id="num-t" className={T_L}>
            <Words text="Los números salen." />
          </h2>
          <p className="max-w-xl text-xl leading-[1.45]">Un banco con 13.816 usuarios, cada mes. La persona no paga nada: paga el banco, según el uso real.</p>
          <div>
            <div className="flex h-14 overflow-hidden rounded-2xl" role="img" aria-label="De cada euro: 44 % IA, 3,5 % mantenimiento y alojamiento, 53 % nos queda">
              {tramos.map((t, i) => (
                <motion.div
                  key={t.l}
                  className={`h-full origin-left ${t.c}`}
                  style={{ width: `${t.w}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.3 }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-lg font-bold">
              {tramos.map((t) => (
                <span key={t.l} className="flex items-center gap-2">
                  <i className={`h-3.5 w-3.5 rounded-full ${t.c}`} />
                  {t.l}
                </span>
              ))}
            </div>
          </div>
          <dl className="flex flex-col gap-2">
            {filas.map((f) => (
              <div key={f.t} className="flex items-baseline justify-between gap-6 rounded-2xl bg-salvia/50 px-6 py-4">
                <dt>
                  <span className="block text-lg font-bold">{f.t}</span>
                  <span className="block text-base text-suave">{f.d}</span>
                </dt>
                <dd className="titular whitespace-nowrap text-2xl font-semibold sm:text-3xl">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col gap-4 lg:pt-4">
          <Reveal className="flex flex-col gap-3 rounded-[2rem] bg-verde p-10 text-crema">
            <p className="text-xl font-bold text-salvia">Resultado operativo al mes</p>
            <p className="titular text-[clamp(3.4rem,6vw,5.6rem)] font-semibold leading-none">
              <Count to={18318} suffix=" €" />
            </p>
            <p className="text-lg">un margen del 53 %.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 rounded-[2rem] bg-salvia p-10">
            <p className="text-xl font-bold text-verde">Cada usuario nuevo nos deja</p>
            <p className="titular text-[clamp(2.8rem,4.5vw,4.2rem)] font-semibold leading-none text-verde">
              <Count to={1.31} decimals={2} prefix="+ " suffix=" €" />
            </p>
            <p className="text-lg">al mes.</p>
          </Reveal>
          <p className="text-base text-suave">Estimación del equipo, sin datos reales. IA: 1 $ ≈ 0,89 €.</p>
        </div>
      </Wrap>
    </section>
  );
}

/* La competencia, en una tabla de verdad. */
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
    <section id="competencia" aria-labelledby="comp-t" className="bg-salvia/50 py-28 lg:py-44">
      <Wrap className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <h2 id="comp-t" className={T_L}>
          <Words text="Nadie más lo junta todo." />
        </h2>
        <Reveal>
          <p className="max-w-xl text-xl leading-[1.45]">Ya hay empresas trabajando en esto. Unas bloquean, otras dejan decidir al cuidador, y ninguna habla y explica a la vez.</p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-14">
        <Reveal>
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
              <caption className="sr-only">Comparativa de Willo con otras soluciones</caption>
              <thead>
                <tr>
                  <th className="w-[30%]" />
                  {COLS.map((c, i) => (
                    <th key={c.n} scope="col" className={`px-2 pb-4 pt-5 text-center align-bottom ${i === 4 ? "rounded-t-3xl bg-verde text-crema" : ""}`}>
                      <span className="block text-lg font-bold">{c.n}</span>
                      <span className={`block text-base font-normal ${i === 4 ? "text-salvia" : "text-suave"}`}>{c.c}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FILAS.map((f, r) => (
                  <motion.tr key={f.t} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: EASE, delay: r * 0.07 }}>
                    <th scope="row" className={`rounded-l-2xl px-5 py-4 text-lg font-bold ${r % 2 ? "" : "bg-fondo"}`}>
                      {f.t}
                    </th>
                    {f.v.map((v, j) => (
                      <td key={j} className={`px-2 py-4 text-center ${j === 4 ? `bg-verde ${r === FILAS.length - 1 ? "rounded-b-3xl" : ""}` : r % 2 ? "" : "bg-fondo"}`}>
                        <span className="inline-flex flex-col items-center gap-1">
                          <Mark v={v} on={j === 4} />
                          {f.nota?.[j] && <span className="text-sm text-suave">{f.nota[j]}</span>}
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

/* Cómo llegamos: tres pasos en un camino. */
export function Camino() {
  const pasos = [
    {
      t: "Con las asociaciones",
      d: "AMÁS ya ha validado Willo y quiere que sus usuarios prueben la demo. Plena inclusión agrupa unas 950 asociaciones y 150.000 personas: ese es nuestro canal, y captar usuarios nos cuesta casi 0 €.",
    },
    { t: "Un piloto con un banco", d: "Willo dentro de su app, con su marca. Esa pantalla ya está hecha." },
    { t: "Más bancos y Europa", d: "La ley viene de una directiva europea: toda la UE tiene la misma obligación." },
  ];
  return (
    <section id="camino" aria-labelledby="camino-t" className="py-28 lg:py-44">
      <Wrap className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <h2 id="camino-t" className={T_L}>
            <Words text="Entramos por las asociaciones." />
          </h2>
          <p className="text-xl leading-[1.45]">Y vendemos a los bancos. Lo que buscamos ahora: contactos en bancos y mentoría para el piloto.</p>
          <div>
            <DemoLink>Ver la demo</DemoLink>
          </div>
        </div>
        <ol className="flex flex-col gap-4">
          {pasos.map((s, i) => (
            <motion.li
              key={s.t}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
              className={`flex min-h-[14rem] flex-col justify-end gap-4 rounded-[2rem] p-8 sm:p-10 ${i === 0 ? "bg-verde text-crema" : i === 1 ? "bg-miel" : "bg-cielo"}`}
            >
              <h3 className="titular text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.02]">{s.t}</h3>
              <p className="max-w-2xl text-lg leading-snug">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Equipo ───────────────────────── */
export function Equipo() {
  const equipo = [
    { n: "Inés", r: "Ingeniera de datos", f: "ines" },
    { n: "Jiawen", r: "Analista de datos", f: "jiawen" },
    { n: "He", r: "Informática y ADE", f: "he" },
    { n: "Nolan", r: "Empresa y tecnología", f: "nolan" },
    { n: "Xingyi", r: "Telecomunicación", f: "xingyi" },
    { n: "Anqi", r: "Economía", f: "anqi" },
  ];
  return (
    <section id="equipo" aria-labelledby="equipo-t" className="bg-salvia py-28 lg:py-44">
      <Wrap className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <h2 id="equipo-t" className={T_XL}>
          <Words text="Somos seis." />
        </h2>
        <Reveal>
          <p className={LEAD}>Datos, tecnología, telecomunicación y economía: nos complementamos.</p>
        </Reveal>
      </Wrap>
      <Wrap className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-6">
        {equipo.map((p, i) => (
          <motion.figure
            key={p.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.07 }}
            className={`group ${i % 2 ? "xl:mt-16" : ""}`}
          >
            <div className={`aspect-[4/5] overflow-hidden rounded-[1.6rem] ${["bg-miel", "bg-coral", "bg-cielo"][i % 3]}`}>
              <img src={`/equipo/${p.f}.jpg`} alt={`Foto de ${p.n}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            </div>
            <figcaption className="mt-4">
              <span className="block text-2xl font-bold">{p.n}</span>
              <span className="block text-lg">{p.r}</span>
            </figcaption>
          </motion.figure>
        ))}
      </Wrap>
    </section>
  );
}

/* ───────────────────────── Cierre: pruébalo + pie ───────────────────────── */
export function Cierre() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const small = typeof window !== "undefined" && window.innerWidth < 640;
  return (
    <footer ref={ref} id="pruebalo" className="relative overflow-hidden bg-noche text-crema">
      <Wrap className="grid items-center gap-14 pb-10 pt-28 lg:grid-cols-[1.2fr_0.8fr] lg:pt-40">
        <div className="flex flex-col gap-8">
          <h2 className={T_XL}>
            <Words text="Pruébalo ahora." />
          </h2>
          <p className={`${LEAD} text-crema`}>Escanea el código con el móvil o abre el enlace. Es la demo de verdad, sin instalar nada.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <DemoLink dark>Abrir la demo</DemoLink>
            <span className="text-lg font-semibold text-salvia">willo-sfh4.onrender.com</span>
          </div>
        </div>
        <motion.a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir la demo de Willo"
          initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.03, rotate: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          className="mx-auto block rounded-[2.4rem] bg-crema p-8 sm:p-10"
        >
          <img src="/qr-willo.svg" alt="Código QR que lleva a la demo de Willo: willo-sfh4.onrender.com" className="h-[min(60vw,300px)] w-[min(60vw,300px)]" />
        </motion.a>
      </Wrap>
      {/* El nombre vuelve a lo ancho, hecho de puntos. */}
      <div className="relative h-[min(46vw,440px)]" aria-hidden="true">
        <ParticleText renderer="canvas" text="willo" color={CREMA} colors={NUBE_NOCHE} active={inView} fitWidth={0.92} fitHeight={0.9} centerY={0.5} gap={2} maxPoints={small ? 2600 : 9500} dotSize={small ? 1.1 : 1.55} />
      </div>
      <Wrap className="flex flex-col gap-4 pb-10 pt-6 text-base text-salvia sm:flex-row sm:items-center sm:justify-between">
        <p>Willo · Tu voluntad, tu dinero. Demo con datos inventados.</p>
        <a href="#inicio" className="font-bold text-crema hover:text-salvia">Volver arriba ↑</a>
      </Wrap>
    </footer>
  );
}
