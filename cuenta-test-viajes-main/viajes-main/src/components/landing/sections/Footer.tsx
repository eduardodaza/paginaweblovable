import { Plane, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone, ArrowRight, Heart } from "lucide-react";
import type { Locale } from "@/lib/types";

export function Footer({ locale }: { locale: Locale }) {
  const es = locale === "es";

  const nav = es
    ? [
        {
          t: "Producto",
          links: [
            { label: "Generador IA",    href: "#generador" },
            { label: "Destinos",        href: "#destinos" },
            { label: "Demo",            href: "#generador" },
            { label: "Precios",         href: "#precios" },
            { label: "Novedades",       href: "#" },
          ],
        },
        {
          t: "Recursos",
          links: [
            { label: "Blog de viajes",  href: "#blog" },
            { label: "Guías de viaje",  href: "#" },
            { label: "Centro de ayuda", href: "#" },
            { label: "Comunidad",       href: "#" },
            { label: "API docs",        href: "#" },
          ],
        },
        {
          t: "Compañía",
          links: [
            { label: "Sobre nosotros",  href: "#" },
            { label: "Carreras",        href: "#" },
            { label: "Prensa",          href: "#" },
            { label: "Contacto",        href: "#" },
            { label: "Privacidad",      href: "#" },
          ],
        },
      ]
    : [
        {
          t: "Product",
          links: [
            { label: "AI Generator",    href: "#generador" },
            { label: "Destinations",    href: "#destinos" },
            { label: "Demo",            href: "#generador" },
            { label: "Pricing",         href: "#precios" },
            { label: "What's new",      href: "#" },
          ],
        },
        {
          t: "Resources",
          links: [
            { label: "Travel blog",     href: "#blog" },
            { label: "Travel guides",   href: "#" },
            { label: "Help center",     href: "#" },
            { label: "Community",       href: "#" },
            { label: "API docs",        href: "#" },
          ],
        },
        {
          t: "Company",
          links: [
            { label: "About us",        href: "#" },
            { label: "Careers",         href: "#" },
            { label: "Press",           href: "#" },
            { label: "Contact",         href: "#" },
            { label: "Privacy",         href: "#" },
          ],
        },
      ];

  return (
    <footer className="border-t" style={{ background: "hsl(260 25% 10%)", borderColor: "rgba(255,255,255,0.06)" }}>
      {/* CTA superior */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {es ? "¿Listo para tu próxima aventura?" : "Ready for your next adventure?"}
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              {es ? "Genera tu itinerario personalizado gratis en segundos." : "Generate your personalized itinerary free in seconds."}
            </p>
          </div>
          <a href="#generador"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white whitespace-nowrap hover:scale-[1.03] transition-all"
            style={{ background: "var(--gradient-hero)", boxShadow: "0 8px 24px hsl(12 85% 55% / 0.4)" }}>
            {es ? "Crear itinerario ahora" : "Create itinerary now"} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" style={{ color: "hsl(12 85% 65%)" }} />
            <p className="text-sm font-medium text-white">
              {es ? "Recibe los mejores destinos y ofertas cada semana" : "Get the best destinations and deals every week"}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder={es ? "tu@email.com" : "your@email.com"}
              className="flex-1 md:w-64 px-4 py-2.5 rounded-full text-sm outline-none border"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }}
            />
            <button
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition"
              style={{ background: "var(--gradient-hero)" }}>
              {es ? "Suscribir" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* Links principales */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white"
              style={{ background: "var(--gradient-hero)" }}>
              <Plane style={{ width: 18, height: 18 }} />
            </span>
            <span className="text-white">TripCraft <span style={{ color: "hsl(12 85% 65%)" }}>AI</span></span>
          </a>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {es
              ? "Itinerarios de viaje personalizados con inteligencia artificial. Gratis, rápido y preciso."
              : "Personalized travel itineraries powered by AI. Free, fast and accurate."}
          </p>

          {/* Contact info */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Mail className="w-3.5 h-3.5" /> hola@tripcraftai.com
            </div>
          </div>

          {/* Redes sociales */}
          <div className="mt-5 flex gap-2">
            {[
              { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { icon: Twitter,   href: "https://twitter.com",   label: "Twitter / X" },
              { icon: Facebook,  href: "https://facebook.com",  label: "Facebook" },
              { icon: Youtube,   href: "https://youtube.com",   label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:border-primary"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {nav.map((col) => (
          <div key={col.t}>
            <div className="font-semibold text-sm mb-4 text-white">{col.t}</div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.45)" }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t px-6 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>© {new Date().getFullYear()} TripCraft AI. {es ? "Todos los derechos reservados." : "All rights reserved."}</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition">{es ? "Privacidad" : "Privacy"}</a>
            <a href="#" className="hover:text-white transition">{es ? "Términos" : "Terms"}</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
            <span className="flex items-center gap-1">
              {es ? "Hecho con" : "Made with"} <Heart className="w-3 h-3 mx-0.5" style={{ color: "hsl(12 85% 65%)" }} fill="hsl(12 85% 65%)" /> {es ? "para viajeros" : "for travelers"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
