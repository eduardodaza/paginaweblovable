// Footer.tsx — Todos los enlaces configurables en SOCIAL_LINKS y NAV_LINKS
// Para actualizar redes sociales: cambia las URLs en SOCIAL_LINKS
// Para nuevas secciones: edita los arrays nav_es / nav_en

import { Plane, Instagram, Twitter, Facebook, Youtube, Mail, ArrowRight, Heart, Send } from "lucide-react";
import type { Locale } from "@/lib/types";

// ─── CONFIGURA AQUÍ TUS REDES SOCIALES ──────────────────────────────────────
// Reemplaza "#" por la URL real cuando crees cada cuenta
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/tripcraftai",   // ← pon tu URL de Instagram
  twitter:   "https://twitter.com/tripcraftai",     // ← pon tu URL de Twitter/X
  facebook:  "https://facebook.com/tripcraftai",    // ← pon tu URL de Facebook
  youtube:   "https://youtube.com/@tripcraftai",    // ← pon tu URL de YouTube
  email:     "mailto:hola@tripcraftai.com",         // ← pon tu email real
  tiktok:    "https://tiktok.com/@tripcraftai",     // ← pon tu URL de TikTok
};
// ─────────────────────────────────────────────────────────────────────────────

// Ícono TikTok (no está en lucide)
function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const es = locale === "es";

  const nav = [
    {
      t: es ? "Producto" : "Product",
      links: [
        { label: es ? "Generador IA"   : "AI Generator",  href: "#generador" },
        { label: es ? "Destinos"       : "Destinations",  href: "#destinos"  },
        { label: "Demo",                                   href: "#generador" },
        { label: es ? "Precios"        : "Pricing",       href: "#precios"   },
        { label: es ? "Novedades"      : "What's new",    href: "#"          },
      ],
    },
    {
      t: es ? "Recursos" : "Resources",
      links: [
        { label: es ? "Blog de viajes" : "Travel blog",   href: "#blog"  },
        { label: es ? "Guías de viaje" : "Travel guides", href: "#"      },
        { label: es ? "Centro de ayuda": "Help center",   href: "#"      },
        { label: es ? "Comunidad"      : "Community",     href: "#"      },
        { label: "API docs",                               href: "#"      },
      ],
    },
    {
      t: es ? "Compañía" : "Company",
      links: [
        { label: es ? "Sobre nosotros" : "About us",  href: "#"  },
        { label: es ? "Carreras"       : "Careers",   href: "#"  },
        { label: es ? "Prensa"         : "Press",     href: "#"  },
        { label: es ? "Contacto"       : "Contact",   href: SOCIAL_LINKS.email },
        { label: es ? "Privacidad"     : "Privacy",   href: "#"  },
      ],
    },
  ];

  return (
    <footer style={{ background: "hsl(230 30% 8%)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

      {/* ── CTA superior ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {es ? "¿Listo para tu próxima aventura?" : "Ready for your next adventure?"}
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {es ? "Genera tu itinerario personalizado gratis en segundos." : "Generate your personalized itinerary free in seconds."}
            </p>
          </div>
          <a
            href="#generador"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white whitespace-nowrap hover:scale-[1.03] transition-all"
            style={{ background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))", boxShadow: "0 8px 24px hsl(12 85% 55% / 0.4)" }}>
            {es ? "Crear itinerario ahora" : "Create itinerary now"} <ArrowRight style={{ width: 16, height: 16 }} />
          </a>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Send style={{ width: 18, height: 18, color: "hsl(12 85% 65%)", flexShrink: 0 }} />
            <p className="text-sm font-medium text-white">
              {es ? "Los mejores destinos y ofertas cada semana, directo a tu bandeja" : "Best destinations and deals weekly, straight to your inbox"}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder={es ? "tu@correo.com" : "your@email.com"}
              className="flex-1 md:w-60 px-4 py-2.5 rounded-full text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
              }}
            />
            <button
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))" }}>
              {es ? "Suscribir" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Cuerpo principal ── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))" }}>
              <Plane style={{ width: 18, height: 18 }} />
            </span>
            <span className="text-white">TripCraft <span style={{ color: "hsl(12 85% 65%)" }}>AI</span></span>
          </a>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.42)" }}>
            {es
              ? "Itinerarios de viaje personalizados con inteligencia artificial. Gratis, rápido y preciso."
              : "Personalized travel itineraries powered by AI. Free, fast and accurate."}
          </p>

          <a href={SOCIAL_LINKS.email} className="mt-4 flex items-center gap-2 text-sm hover:text-white transition"
            style={{ color: "rgba(255,255,255,0.38)" }}>
            <Mail style={{ width: 14, height: 14 }} /> hola@tripcraftai.com
          </a>

          {/* Redes sociales */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { icon: Instagram,   href: SOCIAL_LINKS.instagram, label: "Instagram" },
              { icon: Twitter,     href: SOCIAL_LINKS.twitter,   label: "Twitter / X" },
              { icon: Facebook,    href: SOCIAL_LINKS.facebook,  label: "Facebook" },
              { icon: Youtube,     href: SOCIAL_LINKS.youtube,   label: "YouTube" },
              { icon: TikTokIcon,  href: SOCIAL_LINKS.tiktok,    label: "TikTok" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, hsl(12 85% 55% / 0.3), hsl(38 95% 60% / 0.3))";
                  e.currentTarget.style.borderColor = "hsl(12 85% 55% / 0.5)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {nav.map((col) => (
          <div key={col.t}>
            <div className="font-semibold text-sm mb-5 text-white">{col.t}</div>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") || l.href.startsWith("mailto") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm transition-colors hover:text-white flex items-center gap-1 group"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(12 85% 65%)" }}>›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>© {new Date().getFullYear()} TripCraft AI. {es ? "Todos los derechos reservados." : "All rights reserved."}</span>
          <div className="flex items-center gap-5">
            {[
              { label: es ? "Privacidad" : "Privacy", href: "#" },
              { label: es ? "Términos"   : "Terms",   href: "#" },
              { label: "Cookies",                      href: "#" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white transition">{l.label}</a>
            ))}
            <span className="flex items-center gap-1">
              {es ? "Hecho con" : "Made with"}{" "}
              <Heart style={{ width: 12, height: 12, color: "hsl(12 85% 65%)", fill: "hsl(12 85% 65%)", margin: "0 2px" }} />
              {es ? "para viajeros" : "for travelers"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
