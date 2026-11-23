import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

/** Curva "expo out": arranca rápido y frena suave. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Aparece al entrar en pantalla: sube y gana opacidad. */
export function Reveal({ children, delay = 0, y = 28, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
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
        // Margen negativo + relleno: la máscara no corta acentos ni letras con rabito (g, j, y).
        <span key={i} className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] pt-[0.08em] -mt-[0.08em] align-bottom" aria-hidden="true">
          <motion.span className="inline-block" variants={{ hidden: { y: "115%" }, show: { y: "0%" } }} transition={{ duration: 0.9, ease: EASE }}>
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

/** Pantalla de la app dentro de un marco de móvil. */
export function Phone({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <div className={`rounded-[2.2rem] bg-texto p-[0.45rem] ${className}`}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} className="block h-auto w-full rounded-[1.8rem]" />
    </div>
  );
}

/** Titular de sección: dos líneas como mucho. */
export const T_XL = "titular text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[1.02] tracking-[-0.025em]";
export const T_L = "titular text-[clamp(2.2rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.02em]";
/** Frase de apoyo bajo un titular. */
export const LEAD = "max-w-[38rem] text-xl leading-[1.45] sm:text-2xl";
