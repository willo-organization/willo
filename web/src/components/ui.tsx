import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** Curva "expo out": arranca rápido y frena suave. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Aparece al entrar en pantalla: sube y gana opacidad. Es CSS (index.css, [data-reveal]) y un solo
 * IntersectionObserver para toda la página (useRevelar): mucho más ligero al cargar que un componente animado por bloque.
 */
export function Reveal({ children, delay = 0, y = 28, className = "", carga = false }: { children: ReactNode; delay?: number; y?: number; className?: string; carga?: boolean }) {
  // carga: entra al cargar la página, solo con CSS, sin esperar al JavaScript (lo de la portada).
  return (
    <div data-reveal data-carga={carga || undefined} className={className} style={{ "--d": `${delay}s`, "--y": `${y}px` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Titular que entra palabra a palabra, cada una saliendo de detrás de una máscara (CSS, ver index.css). */
export function Words({ text, className = "", delay = 0, carga = false }: { text: string; className?: string; delay?: number; carga?: boolean }) {
  return (
    <span data-reveal data-carga={carga || undefined} className={className} style={{ "--d": `${delay}s` } as CSSProperties}>
      {/* El texto entero para lectores de pantalla; las palabras animadas van ocultas para ellos. */}
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        // Margen negativo + relleno: la máscara no corta acentos ni letras con rabito (g, j, y).
        <span key={i} className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] pt-[0.08em] -mt-[0.08em] align-bottom" aria-hidden="true">
          <span className="palabra inline-block" style={{ "--i": i } as CSSProperties}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

/** Marca con data-visto cada [data-reveal] que entra en pantalla (una vez). Se llama una sola vez, en App. */
export function useRevelar() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.visto = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const vigila = () => document.querySelectorAll("[data-reveal]:not([data-visto])").forEach((el) => io.observe(el));
    vigila();
    // Lo que aparece después (cambios de pestaña, menús…) también se vigila.
    const mo = new MutationObserver(vigila);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
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
      <img src={src} alt={alt} width={780} height={1688} loading={eager ? "eager" : "lazy"} className="block h-auto w-full rounded-[1.8rem]" />
    </div>
  );
}

/** Titular de sección: dos líneas como mucho. */
export const T_XL = "titular text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[1.02] tracking-[-0.025em]";
export const T_L = "titular text-[clamp(2.2rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.02em]";
/** Frase de apoyo bajo un titular. */
export const LEAD = "max-w-[38rem] text-xl leading-[1.45] sm:text-2xl";
