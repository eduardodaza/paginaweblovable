import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";
import { BannerPublicidadArticulo } from "../ads/AdBanners";

const POSTS = [
  {
    title: "Cómo viajar barato en 2026 sin sacrificar experiencias",
    category: "Ahorro",
    categoryColor: "#0f6e56",
    categoryBg: "#e1f5ee",
    author: "Lucía Martínez",
    date: "12 May 2026",
    readTime: "5 min",
    excerpt: "Descubre los mejores trucos para reducir costos sin perder calidad en tus viajes este año.",
    img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    featured: true,
  },
  {
    title: "Los 10 mejores destinos del mundo para 2026",
    category: "Destinos",
    categoryColor: "#3c3489",
    categoryBg: "#eeedfe",
    author: "Carlos Pérez",
    date: "08 May 2026",
    readTime: "7 min",
    excerpt: "Una selección cuidada de los destinos que marcarán tendencia este año según expertos.",
    img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    title: "Consejos definitivos para ahorrar en hoteles de lujo",
    category: "Hospedaje",
    categoryColor: "#633806",
    categoryBg: "#faeeda",
    author: "Sofía Ruiz",
    date: "01 May 2026",
    readTime: "4 min",
    excerpt: "Las técnicas que usan los viajeros frecuentes para hospedarse en hoteles premium a mitad de precio.",
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    title: "Cómo usar inteligencia artificial para planificar tu viaje perfecto",
    category: "Tecnología",
    categoryColor: "#0c447c",
    categoryBg: "#e6f1fb",
    author: "Daniel López",
    date: "22 Abr 2026",
    readTime: "6 min",
    excerpt: "La IA está revolucionando cómo planificamos viajes. Te explicamos cómo sacarle el máximo partido.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
];

export function Blog({ locale: _locale }: { locale?: string }) {
  const [featured, ...rest] = POSTS;
  return (
    <section id="blog" className="py-28 px-6" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
              style={{ background: "hsl(260 60% 30% / 0.08)", color: "hsl(260 60% 30%)" }}>
              ✦ Blog de viajeros
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Aprende a viajar <span style={{ backgroundImage: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>mejor</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">Artículos gratuitos escritos por viajeros reales de todo el mundo.</p>
          </div>
          <a href="#" className="text-sm font-semibold inline-flex items-center gap-1.5 hover:gap-3 transition-all px-5 py-2.5 rounded-full border"
            style={{ borderColor: "hsl(12 85% 55% / 0.4)", color: "hsl(12 85% 45%)" }}>
            Ver todos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Layout: featured grande + 3 pequeños */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="lg:col-span-3 group rounded-3xl overflow-hidden relative cursor-pointer hover:-translate-y-1 transition-all duration-300"
            style={{ boxShadow: "0 8px 40px -8px rgba(0,0,0,0.14)", minHeight: 480 }}
          >
            <img src={featured.img} alt={featured.title} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 100%)" }} />
            <div className="absolute top-5 left-5">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: featured.categoryBg, color: featured.categoryColor }}>
                {featured.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <h3 className="text-2xl font-bold leading-snug mb-3">{featured.title}</h3>
              <p className="text-sm opacity-80 mb-4 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-3">
                <img src={featured.authorImg} alt={featured.author} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                <span className="text-sm opacity-80">{featured.author}</span>
                <span className="opacity-40">·</span>
                <span className="text-sm opacity-60">{featured.date}</span>
                <span className="opacity-40">·</span>
                <span className="text-sm opacity-60 flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
              </div>
            </div>
          </motion.article>

          {/* Small cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: "0 2px 16px -4px rgba(0,0,0,0.07)" }}
              >
                <div className="w-28 min-w-[7rem] relative overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 p-4 min-w-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={{ background: p.categoryBg, color: p.categoryColor }}>
                    {p.category}
                  </span>
                  <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition line-clamp-2"
                    style={{ color: "hsl(260 30% 12%)" }}>
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <img src={p.authorImg} alt={p.author} className="w-5 h-5 rounded-full object-cover" />
                    <span>{p.author}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {p.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* CTA card */}
            <motion.a
              href="#"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed font-semibold text-sm hover:scale-[1.02] transition-all"
              style={{ borderColor: "hsl(12 85% 55% / 0.3)", color: "hsl(12 85% 45%)" }}
            >
              <User className="w-4 h-4" />
              Publicar en nuestro blog <ArrowRight className="w-4 h-4 ml-auto" />
            </motion.a>
          </div>
        </div>

        <BannerPublicidadArticulo />
      </div>
    </section>
  );
}
