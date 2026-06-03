// Hero.tsx — Fondo 100% CSS: sin imágenes externas, siempre visible en producción
import { motion } from "framer-motion";
import { Sparkles, Compass, Shield, Zap, Star, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/types";

const STATS = [
  { n: "120k+", es: "Viajeros felices",  en: "Happy travelers",   color: "hsl(12 85% 60%)"  },
  { n: "180+",  es: "Países cubiertos",  en: "Countries covered", color: "hsl(280 70% 65%)" },
  { n: "4.9★",  es: "Valoración media",  en: "Average rating",    color: "hsl(38 95% 60%)"  },
];

const TRUST = [
  { icon: Zap,    es: "Listo en 10 segundos",        en: "Ready in 10 seconds"    },
  { icon: Shield, es: "100% gratis · Sin registro",   en: "100% free · No sign-up" },
  { icon: Star,   es: "IA con datos en tiempo real",  en: "Real-time AI data"      },
];

const CHIPS = ["🗼 París","🗻 Japón","🏝 Bali","🗽 NYC","🏛 Roma","🌅 Santorini","🏖 Cartagena","🕌 Dubái"];

export function Hero({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20"
      style={{
        background: "linear-gradient(135deg, hsl(240 45% 8%) 0%, hsl(260 55% 14%) 35%, hsl(280 45% 11%) 65%, hsl(220 50% 9%) 100%)",
      }}
    >
      {/* ── Capas de gradiente animadas ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

        {/* Orbe 1 — naranja/rojo superior izquierda */}
        <div style={{
          position: "absolute", top: "-10%", left: "-8%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(12 90% 55% / 0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* Orbe 2 — púrpura centro derecha */}
        <div style={{
          position: "absolute", top: "20%", right: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(280 80% 60% / 0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />

        {/* Orbe 3 — cyan inferior izquierda */}
        <div style={{
          position: "absolute", bottom: "-5%", left: "15%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(200 85% 55% / 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        {/* Orbe 4 — amarillo centro */}
        <div style={{
          position: "absolute", top: "50%", left: "40%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, hsl(38 95% 65% / 0.12) 0%, transparent 70%)",
          filter: "blur(45px)",
        }} />

        {/* Grid de puntos decorativo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }} />

        {/* Línea diagonal decorativa izquierda */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04 }} preserveAspectRatio="none">
          <line x1="0" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" />
          <line x1="0" y1="20%" x2="30%" y2="100%" stroke="white" strokeWidth="0.5" />
          <line x1="100%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" />
          <line x1="100%" y1="30%" x2="70%" y2="100%" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── Contenido ── */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
          style={{
            background: "linear-gradient(135deg, hsl(12 85% 55% / 0.2), hsl(280 70% 55% / 0.2))",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px hsl(12 85% 55% / 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <Sparkles style={{ width: 14, height: 14, color: "hsl(38 95% 70%)" }} />
          {es ? "✦ Planificador de viajes con Inteligencia Artificial" : "✦ AI-powered travel planner"}
        </motion.div>

        {/* H1 — blanco + gradiente multicolor */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
          className="font-bold tracking-tight leading-[1.08]"
          style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", color: "#fff" }}
        >
          {es ? "El viaje perfecto," : "The perfect trip,"}{" "}
          <br />
          <span style={{
            backgroundImage: "linear-gradient(90deg, hsl(12 90% 65%) 0%, hsl(38 100% 62%) 30%, hsl(280 80% 72%) 65%, hsl(200 85% 68%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px hsl(12 85% 55% / 0.4))",
          }}>
            {es ? "diseñado por IA" : "powered by AI"}
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-7 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          {es
            ? "Dinos tu destino, fechas e intereses. Nuestra IA crea un itinerario completo con restaurantes, eventos locales, alertas de seguridad y opciones de vuelos."
            : "Tell us your destination, dates and interests. Our AI builds a full itinerary with restaurants, local events, safety alerts and flight options."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#generador"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:scale-[1.04]"
            style={{
              background: "linear-gradient(135deg, hsl(12 85% 55%) 0%, hsl(38 95% 58%) 50%, hsl(12 85% 55%) 100%)",
              backgroundSize: "200% 100%",
              boxShadow: "0 8px 32px hsl(12 85% 55% / 0.55), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundPosition = "100% 0"; e.currentTarget.style.boxShadow = "0 12px 40px hsl(12 85% 55% / 0.7), 0 0 0 1px rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundPosition = "0 0"; e.currentTarget.style.boxShadow = "0 8px 32px hsl(12 85% 55% / 0.55), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
          >
            <Sparkles style={{ width: 18, height: 18 }} />
            {es ? "Crear mi itinerario gratis" : "Create my itinerary free"}
          </a>
          <a
            href="#destinos"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-[1.02] group"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.9)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          >
            <Compass style={{ width: 18, height: 18 }} />
            {es ? "Explorar destinos" : "Explore destinations"}
            <ArrowRight style={{ width: 15, height: 15, opacity: 0.6 }} />
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          {TRUST.map(({ icon: Icon, es: esTxt, en: enTxt }) => (
            <div key={esTxt} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              <Icon style={{ width: 15, height: 15, color: "hsl(38 95% 68%)", flexShrink: 0 }} />
              {es ? esTxt : enTxt}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-14 grid grid-cols-3 max-w-md mx-auto gap-3"
        >
          {STATS.map((s) => (
            <div
              key={s.n}
              className="py-5 px-2 rounded-2xl text-center relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(255,255,255,0.1)`,
                borderTop: `2px solid ${s.color}`,
                backdropFilter: "blur(16px)",
                boxShadow: `0 4px 24px ${s.color}22`,
              }}
            >
              <div className="text-2xl md:text-3xl font-bold" style={{ color: "#fff" }}>{s.n}</div>
              <div className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{es ? s.es : s.en}</div>
            </div>
          ))}
        </motion.div>

        {/* Chips de destinos */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
        >
          <span className="text-xs font-mono uppercase tracking-widest mr-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {es ? "popular:" : "popular:"}
          </span>
          {CHIPS.map((d) => (
            <a
              key={d}
              href="#generador"
              className="text-sm px-3.5 py-1.5 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.72)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.72)"; }}
            >
              {d}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Indicador scroll */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>scroll</span>
        <div style={{
          width: 1, height: 40,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          animation: "bounce 2s infinite",
        }} />
      </motion.div>
    </section>
  );
}
