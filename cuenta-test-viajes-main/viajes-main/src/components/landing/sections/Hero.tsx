// Hero.tsx — Sección principal espectacular con paleta de colores viva y multicolor
import { motion } from "framer-motion";
import { Sparkles, Compass, Star, Shield, Zap, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/types";

const STATS = [
  { n: "120k+", es: "Viajeros felices",  en: "Happy travelers"  },
  { n: "180+",  es: "Países cubiertos",  en: "Countries covered" },
  { n: "4.9★",  es: "Valoración media",  en: "Average rating"   },
];

const TRUST = [
  { icon: Zap,    es: "Listo en 10 segundos",         en: "Ready in 10 seconds"        },
  { icon: Shield, es: "100% gratis · Sin registro",    en: "100% free · No sign-up"     },
  { icon: Star,   es: "IA con datos en tiempo real",   en: "AI with real-time data"     },
];

// Fotos rotativas del fondo (Unsplash, libres de derechos)
const BG_PHOTOS = [
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80",
];

export function Hero({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20">

      {/* ── Fondo fotográfico con overlay vibrante ── */}
      <div className="absolute inset-0 -z-10">
        <img
          src={BG_PHOTOS[0]}
          alt="Vista panorámica de un destino turístico"
          loading="eager"
          className="w-full h-full object-cover scale-105"
          style={{ filter: "brightness(0.65) saturate(1.3)" }}
        />
        {/* Overlay multicapa con colores vibrantes */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(8,6,25,0.6) 0%, rgba(8,6,25,0.25) 40%, rgba(8,6,25,0.88) 100%)"
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          background: "linear-gradient(135deg, hsl(260 80% 30% / 0.5) 0%, transparent 50%, hsl(12 85% 45% / 0.4) 100%)"
        }} />
      </div>

      {/* ── Burbujas de color decorativas ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full blur-3xl" style={{ top: "8%",  left: "2%",   width: 380, height: 380, background: "hsl(260 80% 55% / 0.18)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "55%", left: "70%",  width: 420, height: 420, background: "hsl(12 85% 55% / 0.16)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "25%", left: "60%",  width: 250, height: 250, background: "hsl(180 70% 50% / 0.1)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8 border"
          style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(18px)", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          <Sparkles style={{ width: 14, height: 14, color: "hsl(38 95% 70%)" }} />
          {es ? "Itinerarios generados con IA en 10 segundos" : "AI-generated itineraries in 10 seconds"}
        </motion.div>

        {/* Headline principal — multicolor */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white"
        >
          {es ? "El viaje perfecto," : "The perfect trip,"}{" "}
          <br className="hidden md:block" />
          <span style={{
            backgroundImage: "linear-gradient(135deg, hsl(12 85% 65%), hsl(38 95% 65%), hsl(280 80% 75%), hsl(200 80% 65%))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {es ? "diseñado por IA" : "powered by AI"}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {es
            ? "Dinos tu destino, fechas e intereses. La IA crea un itinerario completo con restaurantes, eventos locales, alertas de seguridad y opciones de vuelos."
            : "Tell us your destination, dates and interests. AI builds a complete itinerary with restaurants, events, safety alerts and flight options."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#generador"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-bold text-base shadow-xl hover:scale-[1.04] hover:shadow-2xl transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(12 85% 55%) 0%, hsl(38 95% 60%) 50%, hsl(280 70% 55%) 100%)",
              backgroundSize: "200% 100%",
              boxShadow: "0 12px 40px -8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "100% 0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "0 0")}
          >
            <Sparkles style={{ width: 18, height: 18 }} />
            {es ? "Crear mi itinerario gratis" : "Create my itinerary free"}
          </a>
          <a href="#destinos"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base border transition-all duration-300 hover:scale-[1.02] group"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.25)", color: "#fff" }}
          >
            <Compass style={{ width: 18, height: 18 }} />
            {es ? "Explorar destinos" : "Explore destinations"}
            <ArrowRight style={{ width: 15, height: 15, opacity: 0.6 }} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-5"
        >
          {TRUST.map(({ icon: Icon, es: labelEs, en: labelEn }) => (
            <div key={labelEs} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              <Icon style={{ width: 15, height: 15, color: "hsl(38 95% 70%)" }} />
              {es ? labelEs : labelEn}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-16 grid grid-cols-3 max-w-lg mx-auto gap-3"
        >
          {STATS.map((s, i) => (
            <div key={s.n}
              className="py-4 px-2 rounded-2xl text-center border"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(14px)",
                borderColor: "rgba(255,255,255,0.12)",
                borderTopColor: ["hsl(12 85% 55%)", "hsl(280 70% 60%)", "hsl(38 95% 60%)"][i],
                borderTopWidth: 2,
              }}>
              <div className="text-2xl md:text-3xl font-bold text-white">{s.n}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{es ? s.es : s.en}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll de destinos en banda inferior */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="mt-14 flex items-center gap-3 justify-center flex-wrap"
        >
          {["🗼 París", "🗻 Japón", "🏝 Bali", "🗽 NYC", "🏛 Roma", "🌅 Santorini", "🏖 Cartagena"].map((d) => (
            <a key={d} href="#generador"
              className="text-sm px-3.5 py-1.5 rounded-full border transition-all hover:scale-105 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
              {d}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
          scroll
        </span>
        <div className="w-px h-10" style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
          animation: "pulse 2s infinite",
        }} />
      </motion.div>
    </section>
  );
}
