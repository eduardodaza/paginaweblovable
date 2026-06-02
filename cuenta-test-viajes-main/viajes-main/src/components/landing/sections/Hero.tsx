import { motion } from "framer-motion";
import { Sparkles, Compass, Star, Shield, Zap } from "lucide-react";
import type { Locale } from "@/lib/types";

const STATS = [
  { n: "120k+", es: "Viajeros felices", en: "Happy travelers" },
  { n: "180+",  es: "Países cubiertos", en: "Countries covered" },
  { n: "4.9★",  es: "Valoración media", en: "Average rating" },
];

const TRUST_BADGES = [
  { icon: Zap,    es: "Listo en 10 segundos", en: "Ready in 10 seconds" },
  { icon: Shield, es: "100% gratis y sin registro", en: "100% free, no sign-up" },
  { icon: Star,   es: "IA con datos en tiempo real", en: "AI with real-time data" },
];

export function Hero({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Background foto con overlay multicapa */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2000&q=80"
          alt="Vista panorámica de un destino turístico al atardecer"
          loading="eager"
          className="w-full h-full object-cover scale-105"
          style={{ filter: "brightness(0.75) saturate(1.2)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,8,20,0.55) 0%, rgba(10,8,20,0.35) 40%, rgba(10,8,20,0.85) 100%)" }} />
        {/* Overlay de color cálido sutil */}
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, hsl(12 85% 55% / 0.4) 0%, transparent 60%)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8 border"
          style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.25)", color: "#fff" }}
        >
          <Sparkles className="w-4 h-4" style={{ color: "hsl(12 85% 65%)" }} />
          {es ? "Itinerarios generados con IA en segundos" : "AI-generated itineraries in seconds"}
        </motion.div>

        {/* Headline principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white"
        >
          {es ? (
            <>El viaje perfecto,{" "}<br className="hidden md:block" />
              <span style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                diseñado por IA
              </span>
            </>
          ) : (
            <>The perfect trip,{" "}<br className="hidden md:block" />
              <span style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                powered by AI
              </span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          {es
            ? "Dinos tu destino, fechas e intereses. La IA crea un itinerario completo con restaurantes, eventos, alertas de seguridad y opciones de vuelos."
            : "Tell us your destination, dates and interests. AI builds a full itinerary with restaurants, events, safety alerts and flight options."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#generador"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold text-base shadow-xl hover:scale-[1.04] hover:shadow-2xl transition-all duration-300"
            style={{ background: "var(--gradient-hero)", boxShadow: "0 12px 40px -8px hsl(12 85% 55% / 0.55)" }}>
            <Sparkles className="w-5 h-5" />
            {es ? "Crear mi itinerario gratis" : "Create my itinerary free"}
          </a>
          <a href="#destinos"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base border transition-all duration-300 hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
            <Compass className="w-5 h-5" />
            {es ? "Explorar destinos" : "Explore destinations"}
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          {TRUST_BADGES.map(({ icon: Icon, es: labelEs, en: labelEn }) => (
            <div key={labelEs} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Icon className="w-4 h-4" style={{ color: "hsl(12 85% 65%)" }} />
              {es ? labelEs : labelEn}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-16 grid grid-cols-3 max-w-lg mx-auto gap-4"
        >
          {STATS.map((s) => (
            <div key={s.n}
              className="py-4 px-2 rounded-2xl text-center border"
              style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.15)" }}>
              <div className="text-2xl md:text-3xl font-bold text-white">{s.n}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{es ? s.es : s.en}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
          {es ? "Scroll" : "Scroll"}
        </span>
        <div className="w-[1px] h-12 animate-bounce" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
      </motion.div>
    </section>
  );
}
