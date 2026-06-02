import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import type { Locale } from "@/lib/types";

const PLANS = [
  {
    key: "free",
    es: { name: "Gratis", desc: "Para empezar a explorar", price: "0", period: "siempre", cta: "Comenzar gratis" },
    en: { name: "Free",   desc: "To start exploring",     price: "0", period: "forever",  cta: "Get started free" },
    features: {
      es: ["3 itinerarios al mes", "Hasta 7 días por viaje", "Destinos básicos", "Restaurantes sugeridos", "Alertas de seguridad"],
      en: ["3 itineraries/month", "Up to 7 days per trip", "Basic destinations", "Restaurant suggestions", "Safety alerts"],
    },
    highlight: false,
  },
  {
    key: "pro",
    es: { name: "Pro",  desc: "Para viajeros frecuentes", price: "9", period: "/mes", cta: "Empezar prueba gratis" },
    en: { name: "Pro",  desc: "For frequent travelers",   price: "9", period: "/mo",  cta: "Start free trial" },
    features: {
      es: ["Itinerarios ilimitados", "Hasta 30 días por viaje", "Todos los destinos", "Opciones de vuelos y hoteles", "Tours y experiencias", "Exportar a PDF", "Soporte prioritario"],
      en: ["Unlimited itineraries", "Up to 30 days per trip", "All destinations", "Flight & hotel options", "Tours & experiences", "Export to PDF", "Priority support"],
    },
    highlight: true,
    badge: "Más popular",
  },
];

export function Pricing({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section id="precios" className="py-28 px-6" style={{ background: "hsl(260 20% 97%)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
            style={{ background: "hsl(12 85% 55% / 0.1)", color: "hsl(12 85% 45%)" }}>
            ✦ {es ? "Planes" : "Pricing"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            {es ? "Simple y transparente" : "Simple and transparent"}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            {es ? "Empieza gratis. Actualiza cuando lo necesites." : "Start free. Upgrade when you need to."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan, i) => {
            const p = es ? plan.es : plan.en;
            const feats = es ? plan.features.es : plan.features.en;
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-3xl p-8 border"
                style={plan.highlight ? {
                  background: "hsl(260 30% 10%)",
                  border: "2px solid transparent",
                  backgroundClip: "padding-box",
                  boxShadow: "0 20px 60px -12px rgba(0,0,0,0.25)",
                } : {
                  background: "#fff",
                  borderColor: "rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)",
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: "var(--gradient-hero)", boxShadow: "0 4px 16px hsl(12 85% 55% / 0.5)" }}>
                      <Sparkles className="w-3 h-3" /> {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-semibold mb-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "hsl(260 10% 50%)" }}>
                    {p.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold" style={{ color: plan.highlight ? "#fff" : "hsl(260 30% 12%)" }}>${p.price}</span>
                    <span className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "hsl(260 10% 50%)" }}>{p.period}</span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "hsl(260 10% 50%)" }}>
                    {p.desc}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {feats.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm"
                      style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "hsl(260 30% 12%)" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: plan.highlight ? "hsl(12 85% 55% / 0.2)" : "hsl(12 85% 55% / 0.1)" }}>
                        <Check className="w-3 h-3" style={{ color: "hsl(12 85% 55%)" }} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="#generador"
                  className="block w-full text-center py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={plan.highlight ? {
                    background: "var(--gradient-hero)",
                    color: "#fff",
                    boxShadow: "0 8px 24px hsl(12 85% 55% / 0.4)",
                  } : {
                    background: "transparent",
                    border: "1.5px solid hsl(260 30% 12% / 0.2)",
                    color: "hsl(260 30% 12%)",
                  }}>
                  {p.cta}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
