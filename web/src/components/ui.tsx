import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

/** Curva "expo out": arranca rápido y frena suave. Es la que da la sensación premium. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Aparece al entrar en pantalla: sube, se enfoca y gana opacidad. */
export function Reveal({ children, delay = 0, y = 40, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Titular que entra palabra a palabra, cada una saliendo de detrás de una máscara. */
export function Words({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Cifra que cuenta desde `from` hasta `to` al entrar en pantalla, con puntos de miles. */
export function Count({ to, from = 0, decimals = 0, suffix = "", prefix = "" }: { to: number; from?: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const fmt = (v: number) => prefix + v.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const [shown, setShown] = useState(fmt(reduced ? to : from));
  useEffect(() => {
    if (!inView || reduced) return;
    const c = animate(from, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setShown(fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}

/** Etiqueta pequeña encima de cada titular: número de capítulo y tema. */
export function Eyebrow({ n, children, dark = false }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <Reveal y={16}>
      <p className={`flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-salvia" : "text-verde"}`}>
        <span className="tabular-nums opacity-60">{n}</span>
        <span className={`h-px w-8 ${dark ? "bg-salvia/50" : "bg-verde/40"}`} />
        {children}
      </p>
    </Reveal>
  );
}

/** Pantalla de la app dentro de un marco de móvil. */
export function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-[2.2rem] bg-texto p-[0.45rem] shadow-[0_40px_80px_-20px_rgba(14,20,13,0.45)] ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="block h-auto w-full rounded-[1.8rem]" />
    </div>
  );
}

/** Ventana con barra de título, para presentar cada momento de la demo. */
export function Window({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-25px_rgba(14,20,13,0.35)] ring-1 ring-texto/5 ${className}`}>
      <div className="flex items-center gap-2 border-b border-texto/5 px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-salvia-media/70" />
        <span className="h-3 w-3 rounded-full bg-salvia" />
        <span className="h-3 w-3 rounded-full bg-salvia" />
        <span className="ml-3 truncate text-xs font-semibold text-suave">{title}</span>
      </div>
      {children}
    </div>
  );
}

export const T_XL = "titular text-[clamp(2.4rem,6.2vw,5.6rem)] font-semibold leading-[1.04]";
export const T_L = "titular text-[clamp(2rem,4.6vw,4.2rem)] font-semibold leading-[1.06]";
