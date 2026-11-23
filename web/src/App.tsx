import { MotionConfig, motion } from "motion/react";
import ParticleText from "./components/ParticleText";

const DEMO_URL = "https://willo-sfh4.onrender.com/demo/banco";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
}) as const;

const puntos = [
  { t: "Noa te explica las cuentas", d: "Preguntas hablando. Noa te dice cuánto te queda, en frases cortas. Tú decides." },
  { t: "Avisa de estafas, sin bloquear", d: "Si un pago parece un engaño, Willo te explica por qué y te propone esperar." },
  { t: "Tú eliges tus apoyos", d: "Decides quién te acompaña con tu dinero, y lo puedes cambiar cuando quieras." },
];

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* Portada: la misma animación de partículas que la portada del pitch. */}
      <section className="relative h-svh min-h-[560px] overflow-hidden">
        {/* shortcut: se mide el ancho solo al cargar; en móvil, menos puntos para que no se amontonen. */}
        <ParticleText
          renderer="canvas"
          text="willo"
          fitWidth={0.8}
          fitHeight={0.34}
          centerY={0.4}
          maxPoints={window.innerWidth < 640 ? 1100 : 3500}
          dotSize={window.innerWidth < 640 ? 1.4 : 2}
        />
        <p className="absolute left-4 top-6 text-sm font-semibold sm:left-12 sm:top-12 sm:text-base">
          El modo fácil de tu banco, por voz
        </p>
        <div className="absolute inset-x-4 top-[62%] flex flex-col items-center gap-4 text-center">
          <motion.p {...fade(1.6)} className="titular text-3xl italic text-suave sm:text-5xl">
            Tu voluntad, tu dinero.
          </motion.p>
          <motion.p {...fade(2)} className="max-w-xl text-base text-suave sm:text-xl">
            Para personas con discapacidad intelectual. Su asistente se llama Noa.
          </motion.p>
          <motion.a
            {...fade(2.4)}
            href={DEMO_URL}
            className="mt-2 rounded-full bg-verde px-6 py-3 font-semibold text-fondo outline-offset-4 hover:bg-texto"
          >
            Probar la demo
          </motion.a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-12">
        <h2 className="titular text-3xl sm:text-5xl">Willo explica. Tú decides.</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {puntos.map((p) => (
            <li key={p.t} className="rounded-2xl bg-salvia/60 p-6">
              <h3 className="text-lg font-bold">{p.t}</h3>
              <p className="mt-2 text-suave">{p.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="bg-texto px-4 py-10 text-center text-sm text-salvia sm:px-12">
        Willo · Equipo ChickPEAKS · Demo con datos inventados
      </footer>
    </MotionConfig>
  );
}
