// Destinations.tsx — Galería espectacular con fotos libres de derechos (Unsplash)
// Todas las fotos son de Unsplash bajo licencia libre de uso comercial
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";

const DESTINATIONS = [
  {
    name: "París",       country: "Francia",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "💕 Romántico",   gradient: "from-pink-900/80",
  },
  {
    name: "Roma",        country: "Italia",
    img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🏛 Historia",    gradient: "from-amber-900/80",
  },
  {
    name: "Tokio",       country: "Japón",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🌸 Urbano",      gradient: "from-red-900/80",
  },
  {
    name: "Nueva York",  country: "EE.UU.",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🗽 Icónico",     gradient: "from-blue-900/80",
  },
  {
    name: "Bali",        country: "Indonesia",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🌴 Paraíso",     gradient: "from-green-900/80",
  },
  {
    name: "Dubái",       country: "EAU",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "✨ Lujo",         gradient: "from-yellow-900/80",
  },
  {
    name: "Santorini",   country: "Grecia",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🌊 Mediterráneo", gradient: "from-sky-900/80",
  },
  {
    name: "Cartagena",   country: "Colombia",
    img: "https://images.unsplash.com/photo-1583531352515-8884f6c63dc7?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🏰 Colonial",    gradient: "from-orange-900/80",
  },
  {
    name: "Machu Picchu", country: "Perú",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🧗 Aventura",    gradient: "from-emerald-900/80",
  },
  {
    name: "Londres",     country: "Reino Unido",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "☂️ Clásico",     gradient: "from-slate-900/80",
  },
  {
    name: "Marrakech",   country: "Marruecos",
    img: "https://images.unsplash.com/photo-1553603227-2358aabe821e?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🕌 Exótico",     gradient: "from-rose-900/80",
  },
  {
    name: "Bangkok",     country: "Tailandia",
    img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80&fm=jpg",
    tag: "🛕 Místico",     gradient: "from-violet-900/80",
  },
];

export function Destinations({ locale }: { locale?: string }) {
  const es = locale !== "en";
  return (
    <section id="destinos" className="py-28 px-4 overflow-hidden" style={{ background: "hsl(220 30% 6%)" }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Encabezado sobre fondo oscuro ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4 border"
              style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
              <Sparkles style={{ width: 11, height: 11, color: "hsl(38 95% 65%)" }} />
              {es ? "Destinos más amados" : "Most loved destinations"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
              {es ? "El mundo entero," : "The entire world,"}{" "}
              <span style={{
                backgroundImage: "linear-gradient(135deg, hsl(38 95% 65%), hsl(12 85% 65%), hsl(280 70% 70%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {es ? "a un clic" : "one click away"}
              </span>
            </h2>
            <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              {es ? "Haz clic en cualquier destino para generar tu itinerario personalizado al instante." : "Click any destination to instantly generate your personalized itinerary."}
            </p>
          </div>
          <a href="#generador"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all hover:scale-[1.02] self-start md:self-auto group"
            style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)" }}>
            {es ? "Ver todos los destinos" : "View all destinations"}
            <ArrowRight style={{ width: 15, height: 15 }} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* ── Grid masonry de destinos ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {DESTINATIONS.map((d, i) => (
            <motion.a
              key={d.name}
              href="#generador"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative overflow-hidden rounded-2xl block cursor-pointer"
              style={{
                aspectRatio: [0, 4, 7, 11].includes(i) ? "3/4.5" : "3/4",
                boxShadow: "0 4px 20px -4px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={d.img}
                alt={`${d.name}, ${d.country}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                style={{ transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)" }}
              />

              {/* Overlay doble: sutil en reposo, fuerte en hover */}
              <div className="absolute inset-0 transition-opacity duration-500"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)" }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)` }} />

              {/* Tag superior */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm text-white border"
                  style={{ background: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.2)" }}>
                  {d.tag}
                </span>
              </div>

              {/* Info inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1 text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <MapPin style={{ width: 10, height: 10 }} /> {d.country}
                </div>
                <div className="font-bold text-lg text-white leading-tight">{d.name}</div>
                {/* CTA hover */}
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  style={{ color: "hsl(38 95% 70%)" }}>
                  {es ? "Crear itinerario" : "Create itinerary"} <ArrowRight style={{ width: 12, height: 12 }} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── CTA inferior ── */}
        <div className="mt-10 text-center">
          <a href="#generador"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-sm transition-all hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%), hsl(280 70% 55%))",
              boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
            }}>
            <Sparkles style={{ width: 15, height: 15 }} />
            {es ? "Generar itinerario para cualquier destino" : "Generate itinerary for any destination"}
          </a>
        </div>

      </div>
    </section>
  );
}
