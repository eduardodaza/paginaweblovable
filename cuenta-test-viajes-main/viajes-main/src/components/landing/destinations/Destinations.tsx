import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const DESTINATIONS = [
  { name: "París", country: "Francia",        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",  tag: "Romántico" },
  { name: "Roma",  country: "Italia",         img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",  tag: "Historia" },
  { name: "Tokio", country: "Japón",          img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",  tag: "Urbano" },
  { name: "Nueva York", country: "EE.UU.",    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80",  tag: "Icónico" },
  { name: "Bali",  country: "Indonesia",      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",  tag: "Paraíso" },
  { name: "Dubái", country: "EAU",            img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",  tag: "Lujo" },
  { name: "Santorini", country: "Grecia",     img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",  tag: "Mediterráneo" },
  { name: "Cartagena", country: "Colombia",   img: "https://images.unsplash.com/photo-1583531352515-8884f6c63dc7?auto=format&fit=crop&w=900&q=80",  tag: "Colonial" },
  { name: "Machu Picchu", country: "Perú",    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80",  tag: "Aventura" },
  { name: "Londres", country: "Reino Unido",  img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",  tag: "Clásico" },
];

export function Destinations({ locale: _locale }: { locale?: string }) {
  return (
    <section id="destinos" className="py-28 px-6 overflow-hidden" style={{ background: "hsl(260 20% 98%)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
              style={{ background: "hsl(12 85% 55% / 0.1)", color: "hsl(12 85% 45%)" }}>
              ✦ Destinos destacados
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Inspírate con los lugares<br />
              <span style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                más amados del mundo
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">Haz clic en cualquier destino para generar tu itinerario personalizado.</p>
          </div>
          <a href="#generador"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border hover:scale-[1.02] transition-all self-start md:self-auto"
            style={{ borderColor: "hsl(12 85% 55% / 0.4)", color: "hsl(12 85% 45%)" }}>
            Ver todos los destinos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid mejorado: 2 tamaños diferentes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {DESTINATIONS.map((d, i) => (
            <motion.a
              key={d.name}
              href="#generador"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 5) * 0.06 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl block cursor-pointer"
              style={{
                aspectRatio: i === 0 || i === 4 ? "3/4.5" : "3/4",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={d.img}
                alt={`Vista de ${d.name}, ${d.country}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)" }} />

              {/* Tag superior */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm text-white border"
                  style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.25)" }}>
                  {d.tag}
                </span>
              </div>

              {/* Info inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-1 text-[11px] opacity-80 mb-0.5">
                  <MapPin className="w-3 h-3" /> {d.country}
                </div>
                <div className="font-bold text-lg leading-tight">{d.name}</div>
                {/* Hover CTA */}
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="text-xs font-semibold inline-flex items-center gap-1"
                    style={{ color: "hsl(12 85% 75%)" }}>
                    Crear itinerario <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
