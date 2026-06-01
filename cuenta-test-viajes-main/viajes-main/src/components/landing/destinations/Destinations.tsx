import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const DESTINATIONS = [
  { name: "París", country: "Francia", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" },
  { name: "Roma", country: "Italia", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80" },
  { name: "Tokio", country: "Japón", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80" },
  { name: "Nueva York", country: "EE.UU.", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80" },
  { name: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80" },
  { name: "Dubái", country: "EAU", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" },
  { name: "Santorini", country: "Grecia", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80" },
  { name: "Cartagena", country: "Colombia", img: "https://images.unsplash.com/photo-1583531352515-8884f6c63dc7?auto=format&fit=crop&w=900&q=80" },
  { name: "Machu Picchu", country: "Perú", img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80" },
  { name: "Londres", country: "Reino Unido", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80" },
];

export function Destinations() {
  return (
    <section id="destinos" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Destinos destacados</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">Inspírate con los lugares más amados del mundo</h2>
          <p className="mt-4 text-muted-foreground">Una selección curada para tu próxima aventura.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DESTINATIONS.map((d, i) => (
            <motion.a
              key={d.name}
              href="#generador"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 5) * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={d.img}
                alt={`Vista de ${d.name}, ${d.country}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <MapPin className="w-3 h-3" /> {d.country}
                </div>
                <div className="font-bold text-lg">{d.name}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
