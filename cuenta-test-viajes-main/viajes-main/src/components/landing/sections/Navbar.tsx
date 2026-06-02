import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import type { Locale } from "@/lib/types";

interface Props { locale: Locale; onLocaleChange: (l: Locale) => void; }

export function Navbar({ locale, onLocaleChange }: Props) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/50"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <Plane className="w-5 h-5" />
          </span>
          <span>TripCraft AI</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <li><a href="#destinos" className="hover:text-foreground transition">{locale === "es" ? "Destinos" : "Destinations"}</a></li>
          <li><a href="#generador" className="hover:text-foreground transition">{locale === "es" ? "Generador IA" : "AI Generator"}</a></li>
          <li><a href="#blog" className="hover:text-foreground transition">Blog</a></li>
        </ul>
        <div className="flex items-center gap-3">
          {/* Selector idioma */}
          <div className="flex bg-black/5 rounded-full p-1 text-[10px] font-mono">
            <button onClick={() => onLocaleChange("es")}
              className={`px-3 py-1 rounded-full transition-colors ${locale === "es" ? "bg-white shadow-sm" : "text-muted-foreground"}`}>
              ES
            </button>
            <button onClick={() => onLocaleChange("en")}
              className={`px-3 py-1 rounded-full transition-colors ${locale === "en" ? "bg-white shadow-sm" : "text-muted-foreground"}`}>
              EN
            </button>
          </div>
          <a href="#generador"
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-primary-foreground shadow-md hover:opacity-90 transition"
            style={{ background: "var(--gradient-hero)" }}>
            {locale === "es" ? "Crear itinerario" : "Create itinerary"}
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
