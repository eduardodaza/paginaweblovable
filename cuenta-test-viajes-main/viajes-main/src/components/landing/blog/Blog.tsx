// Blog.tsx — Artículos con fotos libres de derechos (Unsplash, licencia libre)
// Todos los enlaces se abren en nueva pestaña (target="_blank")
// Para agregar artículos reales: edita el array POSTS con la URL real de tu blog

import { motion } from "framer-motion";
import { ArrowRight, Clock, ExternalLink, PenLine } from "lucide-react";
import { BannerPublicidadArticulo } from "../ads/AdBanners";

// ─── CONFIGURA AQUÍ TUS ARTÍCULOS ────────────────────────────────────────────
// href: pon la URL real de cada artículo en tu blog cuando lo publiques
// Las fotos son de Unsplash (dominio público / licencia libre de derechos)
const POSTS = [
  {
    title: "Cómo viajar barato en 2026 sin sacrificar experiencias",
    category: "Ahorro",
    categoryColor: "#0a5c45",
    categoryBg: "#d1f5e8",
    author: "Lucía Martínez",
    date: "12 May 2026",
    readTime: "5 min",
    excerpt: "Descubre los mejores trucos para reducir costos sin perder calidad: vuelos en temporada baja, alojamientos alternativos y cómo usar IA para optimizar cada euro.",
    // Unsplash foto libre: Avión sobre el mar al atardecer
    img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80",
    // Unsplash foto libre: Retrato mujer
    authorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    href: "#blog", // ← Reemplaza con la URL real de tu artículo
    featured: true,
  },
  {
    title: "Los 10 destinos imperdibles del mundo para 2026",
    category: "Destinos",
    categoryColor: "#3c3489",
    categoryBg: "#eeedfe",
    author: "Carlos Pérez",
    date: "08 May 2026",
    readTime: "7 min",
    excerpt: "Una selección de los destinos que marcarán tendencia: desde las islas de Grecia hasta los templos de Japón.",
    // Unsplash: Vista aérea de ciudad costera
    img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    href: "#blog",
  },
  {
    title: "Guía para conseguir hoteles de lujo a precio de hostal",
    category: "Hospedaje",
    categoryColor: "#7d3c00",
    categoryBg: "#fdecd8",
    author: "Sofía Ruiz",
    date: "01 May 2026",
    readTime: "4 min",
    excerpt: "Las técnicas que usan los viajeros frecuentes: last-minute, puntos de fidelidad y mucho más.",
    // Unsplash: Hotel de lujo con piscina
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    href: "#blog",
  },
  {
    title: "IA y viajes: cómo planificar el itinerario perfecto en minutos",
    category: "Tecnología",
    categoryColor: "#0b4c8a",
    categoryBg: "#ddeeff",
    author: "Daniel López",
    date: "22 Abr 2026",
    readTime: "6 min",
    excerpt: "La inteligencia artificial está revolucionando el turismo. Aprende a sacarle el máximo partido.",
    // Unsplash: Persona con laptop en aeropuerto
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    href: "#blog",
  },
  // Artículos extra (galería inferior)
  {
    title: "Santorini en 4 días: el itinerario definitivo",
    category: "Europa",
    categoryColor: "#005f73",
    categoryBg: "#caf0f8",
    author: "Elena Torres",
    date: "15 Abr 2026",
    readTime: "8 min",
    excerpt: "Amanecer en Oia, cuevas de Akrotiri y los mejores restaurantes con vistas al volcán.",
    // Unsplash: Santorini vistas azules
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    href: "#blog",
    mini: true,
  },
  {
    title: "Cartagena de Indias: joyas ocultas del Caribe colombiano",
    category: "América",
    categoryColor: "#6d0a2e",
    categoryBg: "#fce4ec",
    author: "Andrés Mora",
    date: "10 Abr 2026",
    readTime: "5 min",
    excerpt: "Más allá de las murallas: playas secretas, gastronomía local y el casco antiguo de noche.",
    // Unsplash: Ciudad colonial colorida
    img: "https://images.unsplash.com/photo-1583531352515-8884f6c63dc7?auto=format&fit=crop&w=900&q=80",
    authorImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    href: "#blog",
    mini: true,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export function Blog({ locale }: { locale?: string }) {
  const es = locale !== "en";
  const [featured, ...rest] = POSTS.filter((p) => !p.mini);
  const miniPosts = POSTS.filter((p) => p.mini);

  return (
    <section id="blog" className="py-28 px-4 overflow-hidden" style={{ background: "hsl(260 20% 97%)" }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Encabezado ── */}
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
              style={{ background: "hsl(260 60% 30% / 0.08)", color: "hsl(260 60% 30%)" }}>
              ✦ {es ? "Blog de viajeros" : "Traveler Blog"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {es ? "Aprende a viajar " : "Travel "}<span style={{ backgroundImage: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {es ? "mejor" : "smarter"}
              </span>
            </h2>
            <p className="mt-3 text-lg" style={{ color: "hsl(260 10% 45%)" }}>
              {es ? "Artículos gratuitos con fotos libres de derechos, escritos por viajeros reales." : "Free articles with royalty-free photos, written by real travelers."}
            </p>
          </div>
          <a
            href="#blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all hover:scale-[1.02] group"
            style={{ borderColor: "hsl(12 85% 55% / 0.4)", color: "hsl(12 85% 45%)" }}>
            {es ? "Ver todos" : "See all"} <ArrowRight style={{ width: 16, height: 16 }} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* ── Layout principal: Featured grande + 3 cards ── */}
        <div className="grid lg:grid-cols-5 gap-5 mb-5">

          {/* Artículo destacado */}
          <motion.a
            href={featured.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="lg:col-span-3 group rounded-3xl overflow-hidden relative block"
            style={{ minHeight: 500, boxShadow: "0 12px 50px -10px rgba(0,0,0,0.18)" }}
          >
            <img
              src={featured.img}
              alt={featured.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)" }} />

            {/* Badge */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: featured.categoryBg, color: featured.categoryColor }}>
                {featured.category}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full text-white border"
                style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
                ⭐ {es ? "Destacado" : "Featured"}
              </span>
            </div>

            {/* Contenido inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <h3 className="text-2xl md:text-3xl font-bold leading-snug mb-3 group-hover:underline decoration-white/40 underline-offset-4">
                {featured.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={featured.authorImg} alt={featured.author} className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{featured.author}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                  <span className="text-sm flex items-center gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <Clock style={{ width: 12, height: 12 }} /> {featured.readTime}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all"
                  style={{ color: "hsl(38 95% 70%)" }}>
                  {es ? "Leer artículo" : "Read article"} <ExternalLink style={{ width: 12, height: 12 }} />
                </span>
              </div>
            </div>
          </motion.a>

          {/* Cards laterales */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                className="group flex bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }}
              >
                {/* Imagen */}
                <div className="w-32 min-w-[8rem] relative overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                {/* Info */}
                <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
                      style={{ background: p.categoryBg, color: p.categoryColor }}>
                      {p.category}
                    </span>
                    <h3 className="font-bold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors"
                      style={{ color: "hsl(260 30% 12%)" }}>
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: "hsl(260 10% 50%)" }}>
                      <img src={p.authorImg} alt={p.author} className="w-5 h-5 rounded-full object-cover" />
                      <span>{p.author}</span>
                      <span>·</span>
                      <Clock style={{ width: 11, height: 11 }} />{p.readTime}
                    </div>
                    <ExternalLink style={{ width: 12, height: 12, flexShrink: 0, opacity: 0.3 }} className="group-hover:opacity-70 transition" />
                  </div>
                </div>
              </motion.a>
            ))}

            {/* CTA publicar */}
            <motion.a
              href="mailto:blog@tripcraftai.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.35 }}
              className="group flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed font-semibold text-sm transition-all hover:scale-[1.02] hover:border-solid"
              style={{ borderColor: "hsl(12 85% 55% / 0.35)", color: "hsl(12 85% 45%)", background: "hsl(12 85% 55% / 0.03)" }}
            >
              <PenLine style={{ width: 16, height: 16 }} />
              {es ? "Publicar en nuestro blog" : "Write for our blog"}
              <ArrowRight style={{ width: 15, height: 15, marginLeft: "auto" }} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>

        {/* ── Galería de artículos extra (fotos libres de derechos) ── */}
        <div className="grid sm:grid-cols-2 gap-5 mt-2">
          {miniPosts.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl block"
              style={{ height: 220, boxShadow: "0 4px 24px -6px rgba(0,0,0,0.12)" }}
            >
              <img src={p.img} alt={p.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%)" }} />
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: p.categoryBg, color: p.categoryColor }}>
                  {p.category}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-bold text-base leading-snug mb-2 group-hover:underline decoration-white/40 underline-offset-4">
                  {p.title}
                </h3>
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <img src={p.authorImg} alt={p.author} className="w-5 h-5 rounded-full object-cover" />
                  {p.author} · <Clock style={{ width: 11, height: 11 }} /> {p.readTime}
                  <ExternalLink style={{ width: 11, height: 11, marginLeft: "auto", opacity: 0.5 }} className="group-hover:opacity-100 transition" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <BannerPublicidadArticulo />
      </div>
    </section>
  );
}
