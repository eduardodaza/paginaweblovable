import { motion } from "framer-motion";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/types";

interface Props { locale: Locale; onLocaleChange: (l: Locale) => void; }

export function Navbar({ locale, onLocaleChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const es = locale === "es";
  const links = [
    { href: "#destinos", label: es ? "Destinos" : "Destinations" },
    { href: "#generador", label: es ? "Generador IA" : "AI Generator" },
    { href: "#blog",      label: "Blog" },
    { href: "#precios",   label: es ? "Precios" : "Pricing" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderColor: "rgba(0,0,0,0.07)" }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 font-bold text-lg group">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white group-hover:scale-105 transition-transform"
            style={{ background: "var(--gradient-hero)", boxShadow: "0 4px 12px hsl(12 85% 55% / 0.35)" }}
          >
            <Plane className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </span>
          <span className="text-foreground">TripCraft <span style={{ color: "hsl(12 85% 55%)" }}>AI</span></span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}
                className="px-4 py-2 rounded-full text-muted hover:text-foreground hover:bg-black/5 transition-all duration-200">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Selector idioma */}
          <div className="hidden md:flex bg-black/6 rounded-full p-1 text-[11px] font-mono border" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
            {(["es", "en"] as Locale[]).map((loc) => (
              <button key={loc} onClick={() => onLocaleChange(loc)}
                className={`px-3 py-1 rounded-full transition-all font-semibold ${
                  locale === loc ? "bg-white shadow-sm text-foreground" : "text-muted hover:text-foreground"
                }`}>
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          <a href="#generador"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full text-white shadow-md hover:opacity-90 hover:scale-[1.02] transition-all"
            style={{ background: "var(--gradient-hero)", boxShadow: "0 4px 16px hsl(12 85% 55% / 0.3)" }}>
            ✦ {es ? "Crear itinerario" : "Create itinerary"}
          </a>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-black/5 transition" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t px-6 py-4 space-y-1" style={{ borderColor: "rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.97)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-black/5 transition">
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex items-center gap-3">
            <div className="flex bg-black/5 rounded-full p-1 text-[11px] font-mono">
              {(["es", "en"] as Locale[]).map((loc) => (
                <button key={loc} onClick={() => onLocaleChange(loc)}
                  className={`px-3 py-1 rounded-full transition-all ${locale === loc ? "bg-white shadow-sm font-semibold" : "text-muted"}`}>
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#generador" onClick={() => setMobileOpen(false)}
              className="flex-1 text-center text-sm font-semibold px-4 py-2.5 rounded-full text-white"
              style={{ background: "var(--gradient-hero)" }}>
              {es ? "Crear itinerario" : "Create itinerary"}
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
