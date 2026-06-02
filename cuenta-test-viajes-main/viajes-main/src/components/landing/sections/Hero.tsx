import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";
import type { Locale } from "@/lib/types";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2000&q=80"
          alt="Vista panorámica de un destino turístico al atardecer"
          loading="eager"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          {locale === "es" ? "Itinerarios generados con IA en segundos" : "AI-generated itineraries in seconds"}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          {locale === "es" ? (
            <>El viaje perfecto{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>creado por ti mismo</span></>
          ) : (
            <>The perfect trip{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>crafted by you</span></>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {locale === "es"
            ? "Genera itinerarios personalizados en segundos según tus fechas, presupuesto e intereses."
            : "Generate personalized itineraries in seconds based on your dates, budget and interests."}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#generador"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-primary-foreground font-semibold shadow-lg hover:scale-[1.03] transition"
            style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-premium)" }}>
            <Sparkles className="w-4 h-4" /> {locale === "es" ? "Crear itinerario" : "Create itinerary"}
          </a>
          <a href="#destinos"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-card border border-border font-semibold hover:bg-accent/10 transition">
            <Compass className="w-4 h-4" /> {locale === "es" ? "Explorar destinos" : "Explore destinations"}
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-center">
          {[
            { n: "120k+", l: locale === "es" ? "Viajeros" : "Travelers" },
            { n: "180+",  l: locale === "es" ? "Países" : "Countries" },
            { n: "4.9★",  l: locale === "es" ? "Valoración" : "Rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-bold">{s.n}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
