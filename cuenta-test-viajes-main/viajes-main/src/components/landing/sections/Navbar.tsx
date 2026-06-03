// Navbar.tsx — Navegación con indicador de scroll activo y menú mobile completo
import { motion } from "framer-motion";
import { Plane, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/types";

interface Props { locale: Locale; onLocaleChange: (l: Locale) => void; }

export function Navbar({ locale, onLocaleChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const es = locale === "es";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#destinos",  label: es ? "Destinos"      : "Destinations"  },
    { href: "#generador", label: es ? "Generador IA"  : "AI Generator"  },
    { href: "#blog",      label: "Blog"                                  },
    { href: "#precios",   label: es ? "Precios"        : "Pricing"       },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(10,8,25,0.4)",
        backdropFilter: "blur(20px)",
        borderColor: scrolled ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 font-bold text-lg group">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white group-hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))", boxShadow: "0 4px 12px hsl(12 85% 55% / 0.35)" }}>
            <Plane style={{ width: 18, height: 18 }} />
          </span>
          <span style={{ color: scrolled ? "hsl(260 30% 12%)" : "#fff" }}>
            TripCraft <span style={{ color: "hsl(12 85% 60%)" }}>AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}
                className="px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/10"
                style={{ color: scrolled ? "hsl(260 10% 45%)" : "rgba(255,255,255,0.8)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = scrolled ? "hsl(260 30% 12%)" : "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = scrolled ? "hsl(260 10% 45%)" : "rgba(255,255,255,0.8)"; }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {/* Selector idioma */}
          <div className="hidden md:flex rounded-full p-1 text-[11px] font-mono border"
            style={{
              background: scrolled ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
              borderColor: scrolled ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
            }}>
            {(["es", "en"] as Locale[]).map((loc) => (
              <button key={loc} onClick={() => onLocaleChange(loc)}
                className="px-3 py-1 rounded-full transition-all font-semibold"
                style={{
                  background: locale === loc ? (scrolled ? "#fff" : "rgba(255,255,255,0.2)") : "transparent",
                  color: locale === loc ? (scrolled ? "hsl(260 30% 12%)" : "#fff") : (scrolled ? "hsl(260 10% 55%)" : "rgba(255,255,255,0.5)"),
                  boxShadow: locale === loc && scrolled ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}>
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          <a href="#generador"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-full text-white shadow-md hover:opacity-90 hover:scale-[1.02] transition-all"
            style={{ background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))", boxShadow: "0 4px 16px hsl(12 85% 55% / 0.35)" }}>
            ✦ {es ? "Crear itinerario" : "Create itinerary"}
          </a>

          {/* Hamburguesa */}
          <button className="md:hidden p-2 rounded-lg transition"
            style={{ color: scrolled ? "hsl(260 30% 12%)" : "#fff" }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t px-6 py-4 space-y-1"
          style={{ borderColor: "rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-black/5 transition"
              style={{ color: "hsl(260 30% 12%)" }}>
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex items-center gap-3">
            <div className="flex bg-black/5 rounded-full p-1 text-[11px] font-mono border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {(["es", "en"] as Locale[]).map((loc) => (
                <button key={loc} onClick={() => onLocaleChange(loc)}
                  className={`px-3 py-1 rounded-full transition-all ${locale === loc ? "bg-white shadow-sm font-semibold" : "text-muted"}`}>
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#generador" onClick={() => setMobileOpen(false)}
              className="flex-1 text-center text-sm font-bold px-4 py-2.5 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, hsl(12 85% 55%), hsl(38 95% 60%))" }}>
              {es ? "✦ Crear itinerario" : "✦ Create itinerary"}
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
