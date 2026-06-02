import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BannerPublicidadArticulo } from "../ads/AdBanners";

const POSTS = [
  { title: "Cómo viajar barato en 2026", category: "Ahorro", author: "Lucía Martínez", date: "12 May 2026", img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80" },
  { title: "Los mejores destinos del mundo", category: "Destinos", author: "Carlos Pérez", date: "08 May 2026", img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80" },
  { title: "Consejos para ahorrar en hoteles", category: "Hospedaje", author: "Sofía Ruiz", date: "01 May 2026", img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80" },
  { title: "Cómo usar IA para viajar", category: "Tecnología", author: "Daniel López", date: "22 Abr 2026", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80" },
];

export function Blog({ locale: _locale }: { locale?: string }) {
  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Blog de viajes</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Aprende a viajar mejor</h2>
          </div>
          <a href="#" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POSTS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-1 transition-all"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-card/95 backdrop-blur">{p.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition">{p.title}</h3>
                <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                  <span>{p.author}</span>·<span>{p.date}</span>
                </div>
                <a href="#" className="mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Leer más <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <BannerPublicidadArticulo />
      </div>
    </section>
  );
}
