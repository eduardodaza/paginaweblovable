import { Plane, Instagram, Twitter, Facebook } from "lucide-react";
import type { Locale } from "@/lib/types";

export function Footer({ locale }: { locale: Locale }) {
  const nav = locale === "es"
    ? [
        { t: "Producto", l: ["Generador IA", "Destinos", "Precios"] },
        { t: "Recursos",  l: ["Blog", "Guías", "Centro de ayuda"] },
        { t: "Compañía",  l: ["Sobre nosotros", "Carreras", "Contacto"] },
      ]
    : [
        { t: "Product",  l: ["AI Generator", "Destinations", "Pricing"] },
        { t: "Resources", l: ["Blog", "Guides", "Help Center"] },
        { t: "Company",  l: ["About us", "Careers", "Contact"] },
      ];

  return (
    <footer className="border-t border-border bg-card/50 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <a href="#" className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
              <Plane className="w-5 h-5" />
            </span>
            TripCraft AI
          </a>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            {locale === "es"
              ? "Itinerarios de viaje personalizados con inteligencia artificial."
              : "Personalized travel itineraries powered by artificial intelligence."}
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary"><Twitter className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-primary"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
        {nav.map((c) => (
          <div key={c.t}>
            <div className="font-semibold mb-3">{c.t}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.l.map((x) => <li key={x}><a href="#" className="hover:text-foreground transition">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TripCraft AI. {locale === "es" ? "Todos los derechos reservados." : "All rights reserved."}
      </div>
    </footer>
  );
}
